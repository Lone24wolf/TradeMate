# views.py

from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_GET
from django.contrib.auth.hashers import check_password
from rest_framework.parsers import JSONParser
from django.http.response import JsonResponse,HttpResponse
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from rest_framework.response import Response
# from tensorflow.keras.layers import LSTM
from tensorflow.keras.initializers import glorot_uniform
import csv
from io import TextIOWrapper,StringIO
# from django.http import JsonResponse
from rest_framework.decorators import api_view
from playground.models import User
from playground.models import History
from playground.serializers import UsersSerializer
from playground.serializers import HistorySerializer
from django.db import close_old_connections
import pandas as pd
import joblib
import json
from django.utils import timezone
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



Modelpath = r'C:\Users\abhyu\OneDrive\Desktop\pr\trademate-main\models\AKAM_stock_lstm_model.keras'


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
                return JsonResponse({'message': 'Added Successfully', 'email': email},safe = False)
            return JsonResponse("Failed to add",safe=False)
        return JsonResponse("password not match",safe=False)


@csrf_exempt
def login_user(request):
    if request.method == 'POST':
        user_data = JSONParser().parse(request)
        email = user_data.get('email')
        password = user_data.get('password')
        # print(password)
        if not email:
            return JsonResponse({'error': 'Please provide an email.'}, status=400)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return JsonResponse({'error': 'Email not found. Please sign up.'}, status=404)

        if password==user.password:
            return JsonResponse({'message': 'Login successful.'}, status=200)
        else:
            # print((user.password))
            return JsonResponse({'error': 'Incorrect password.'},status=401)

    return JsonResponse({'error': 'Invalid request method.'}, status=405)

@csrf_exempt
def get_history(request):
    if request.method=='POST':
        email = request.body.decode('utf-8').strip()
        print(email)
        data = History.objects.filter(email=email)
        serialized_data = list(data.values())  
        return JsonResponse(serialized_data, safe=False, status=200)


@csrf_exempt
def predict_stocks(request):
    if request.method == 'POST' and request.FILES['csvFile']:
        uploaded_file = request.FILES['csvFile']
        email = request.POST.get('email')
        # print(email)
        decoded_file = uploaded_file.read().decode('utf-8')
        symbols_df = pd.read_csv(StringIO(decoded_file))
        # print(symbols_df)
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
        print(numerical_value)
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
        print(uploaded_file.name)
        # uploaded_file.name = f"{email}/{uploaded_file.name}"
        # print(type(uploaded_file))
        print(uploaded_file.name)
        # print(file_name)
        # filename = uploaded_file.split('/')[-1]
        data = {
            'email': email,
            'csv_file': uploaded_file,
            'stock_symbols': symbols_continuation,
            'date': timezone.now().date(),
            'time': timezone.now().time()
        }
        

        # print("Data being serialized:", data)

        serializer = HistorySerializer(data=data)
        if serializer.is_valid():
            print("Serializer is valid. Saving data.")
            serializer.save()
            return JsonResponse({'symbols': symbols_json}, status=201)
        else:
            return JsonResponse(serializer.errors, status=400)
    else:
        return JsonResponse({'error': 'No file uploaded'}, status=400)

