# views.py

from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from django.http.response import JsonResponse,HttpResponse
# from tensorflow.keras.layers import LSTM
from tensorflow.keras.initializers import glorot_uniform

from playground.models import User
from playground.serializers import UsersSerializer
from django.db import close_old_connections
import pandas as pd
import joblib
import pickle
from tensorflow.keras.models import model_from_json
# from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Bidirectional, LSTM, Dense
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import load_model
from custom_layers import CustomOrthogonal
# from tensorflow.keras.optimizers import Adam
# from tensorflow.keras.callbacks import ModelCheckpoint
import tensorflow as tf
# from tensorflow.keras.models import Sequential
# from tensorflow.keras.layers import Dense
import numpy as np
# import tensorflow as tf

# Import your model's architecture
# from .your_model_architecture import create_model

# Modelpath  = 'C:/Users/gaura/pr/seperate Files/A_model.keras'
Modelpath = 'C:/Users/gaura/OneDrive/Desktop/Pr/models/AKAM_stock_lstm_model.keras'

# with open('C:/Users/gaura/pr/seperate Files/A_model.sav', 'rb') as file:
#     model = pickle.load(file)
# model = joblib.load('C:/Users/gaura/pr/seperate Files/extra_trees.joblib')
# lstm = LSTM(50, kernel_initializer=glorot_uniform(), recurrent_initializer=glorot_uniform())
# from tensorflow.keras.initializers import Orthogonal

# initializer = Orthogonal(gain=1.0, seed=None)

model = load_model(Modelpath)
# model.save_weights('model_weights.h5')
# import tensorflow as tf
# print(tf.__version__)
# model_stock1 = pickle.load(open("C:/Users/gaura/OneDrive/Desktop/Pr/api/playground/alpha1.pkl",'rb'))

# model = create_model()  # Function to create your model
# model.load_weights(Modelpath)
# def load_model_and_scaler(symbol):
#     model_architecture_path = f"C:/Users/gaura/pr/seperate Files/{symbol}_model_architecture.json"
#     model_weights_path = f"C:/Users/gaura/pr/seperate Files/{symbol}_model_weights.h5"
#     scaler_path = f"C:/Users/gaura/pr/seperate Files/{symbol}_scaler.pkl"
#     # Load the model architecture
#     with open(model_architecture_path, 'r') as json_file:
#         loaded_model_json = json_file.read()
#     model = model_from_json(loaded_model_json)

#     # Load the model weights
#     model.load_weights(model_weights_path)

#     # Load the scaler
#     scaler = joblib.load(scaler_path)

#     return model, scaler


# def load_model_and_scaler(symbol):
#     # Load the model architecture
#     with open(f'{symbol}_model_architecture.json', 'r') as json_file:
#         loaded_model_json = json_file.read()
#     model = model_from_json(loaded_model_json)

#     # Load the model weights
#     model.load_weights(f'{symbol}_model_weights.h5')

#     # Load the scaler
#     scaler = joblib.load(f'{symbol}_scaler.pkl')

#     return model, scaler
# for this files shouls be kept in folder where manage.py is present
# # Example usage
# symbol = 'CMG'  # Example symbol
# loaded_model, loaded_scaler = load_model_and_scaler(symbol)


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
    # close_old_connections()



def predict_stocks(request):
    if request.method == 'POST':
        file = request.FILES['file']


# def predict(request):
#     if request.method == 'POST' and request.FILES['file']:
#         csv_file = request.FILES['file']
#         df = pd.read_csv(csv_file)
        
#         # Assuming 'ticker' is the column name containing ticker values
#         ticker_values = df['ticker'].tolist()

#         # Use your loaded model to make predictions
#         predictions = model.predict(ticker_values)

#         # You can send this back to the frontend as JSON
#         return JsonResponse({'predictions': predictions.tolist()})
#     else:
#         return JsonResponse({'error': 'Invalid request'})
# def add_person(request):

#     # records = {
#     #             "email": "gaurav",
#     #             "password":"123"
#     #         }
#     email = 'abc@gmail.com'
#     password = '123'
#     # user = User(email=email)
#     user = User(password=password)
#     # user.set_password(password)  # Hash the password
#     user.save()
#     # print(email)
#     # User.insert_one(records)
#     return HttpResponse("added")

        

