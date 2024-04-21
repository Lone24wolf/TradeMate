# views.py

from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from django.http.response import JsonResponse,HttpResponse
# from tensorflow.keras.layers import LSTM
from tensorflow.keras.initializers import glorot_uniform
import csv
from io import TextIOWrapper,StringIO
# from django.http import JsonResponse
from rest_framework.decorators import api_view
from playground.models import User
from playground.serializers import UsersSerializer
from django.db import close_old_connections
import pandas as pd
import joblib
import json
# import pickle
from tensorflow.keras.models import model_from_json
# from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Bidirectional, LSTM, Dense
# from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import load_model
# from custom_layers import CustomOrthogonal
# from tensorflow.keras.optimizers import Adam
# from tensorflow.keras.callbacks import ModelCheckpoint
import tensorflow as tf
# from tensorflow.keras.models import Sequential
# from tensorflow.keras.layers import Dense
import numpy as np


# Modelpath  = 'C:/Users/gaura/pr/seperate Files/A_model.keras'
Modelpath = 'C:/Users/gaura/OneDrive/Desktop/Pr/models/AKAM_stock_lstm_model.keras'


model = load_model(Modelpath)



@csrf_exempt
def register_user(request):
    if request.method=='GET':
        users = User.objects.all()
        user_seri = UsersSerializer(users,many=True)
        return JsonResponse(user_seri.data,safe=False)
    elif request.method=='POST':
        user_data = JSONParser().parse(request)
        print(user_data)
        email = user_data['email']
        password  =user_data['password']
        cnfpassword = user_data['confirmPassword']
        print(email)
        user_seri = UsersSerializer(data = user_data)
        if password == cnfpassword:
            if user_seri.is_valid():
                user_seri.save()
                return JsonResponse("Added Successfully",safe = False)
            return JsonResponse("Failed to add",safe=False)
        return JsonResponse("password not match",safe=False)

@csrf_exempt
def predict_stocks(request):
    if request.method == 'POST' and request.FILES['csvFile']:
        uploaded_file = request.FILES['csvFile']
        decoded_file = uploaded_file.read().decode('utf-8')
        symbols_df = pd.read_csv(StringIO(decoded_file))
        clusters_df = pd.read_csv('cluster_labels.csv')
        merged_df = pd.merge(symbols_df, clusters_df, on='Symbol', how='left')

        result_df = merged_df[['Symbol', 'Cluster']].dropna()

        cluster_freq = result_df['Cluster'].value_counts().reset_index()
        cluster_freq.columns = ['Cluster', 'Frequency']

        cluster_extreme=pd.read_csv('cluster_extreme.csv')

        merged_df = pd.merge(cluster_extreme, cluster_freq, on='Cluster', how='left')

        open_min = merged_df['Frequency'] * merged_df['Open_min']
        open_max = merged_df['Frequency'] * merged_df['Open_max']

        open_min_avg = open_min.sum()/10;
        open_max_avg = open_max.sum()/10;

        def check_range(value, min_value, max_value, cluster):
            if min_value <= value <= max_value:
                return cluster
            else:
                return None

        numerical_value = (open_min_avg+open_max_avg)/2  # Replace this with your numerical value

        def calculate_distance(value, min_value, max_value):
            midpoint = (min_value + max_value) / 2
            return abs(value - midpoint)

        cluster_extreme['Distance'] = cluster_extreme.apply(lambda row: calculate_distance(numerical_value, row['Open_min'], row['Open_max']), axis=1)

        cluster_order = cluster_extreme.sort_values('Distance')['Cluster'].tolist()
        
        df = pd.read_csv('sorted_file2.csv')
        total_count = 0

        symbols_continuation = []

        for cluster in cluster_order:
            cluster_df = df[df['Cluster'] == cluster]
            
            remaining_count = 10 - total_count
            
            symbols = cluster_df['Symbol'].tolist()[:remaining_count]
            
            total_count += len(symbols)
            
            symbols_continuation.extend(symbols)
            
            if total_count == 10:
                break

        if total_count < 10:
            next_cluster = cluster_order[cluster_order.index(cluster) + 1]
            next_cluster_symbols = df[df['Cluster'] == next_cluster]['Symbol'].tolist()
            
            remaining_count = 10 - total_count
            
            next_cluster_symbols = next_cluster_symbols[:remaining_count]
            
            symbols_continuation.extend(next_cluster_symbols)

        symbols_json = json.dumps(symbols_continuation)

        print("Symbols JSON:")
        print(symbols_json)


        return JsonResponse({'symbols': symbols_json})
    else:
        return JsonResponse({'error': 'No file uploaded'}, status=400)

