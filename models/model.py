import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Bidirectional, LSTM, Dense
import os

symbols = ['CMG']

for symbol in symbols:
    df = pd.read_csv(f'{symbol}.csv')

    # Prepare the data
    data = df[['Open']].values
    scaler = MinMaxScaler(feature_range=(0, 1))
    scaled_data = scaler.fit_transform(data)

    # Create sequences
    def create_sequence(data, seq_length):
        X, y = [], []
        for i in range(len(data) - seq_length):
            X.append(data[i : i + seq_length])
            y.append(data[i + seq_length])
        return np.array(X), np.array(y)
        
    seq_length = 50    
    X, y = create_sequence(scaled_data, seq_length)

    # Split the data
    split_ratio = 0.8
    split = int(split_ratio * len(X))
    X_train, X_test = X[:split], X[split:]
    y_train, y_test = y[:split], y[split:]

    # Reshape input data
    X_train = X_train.reshape((X_train.shape[0], X_train.shape[1], 1))
    X_test = X_test.reshape((X_test.shape[0], X_test.shape[1], 1))

    # Build BiLSTM model
    model = Sequential()
    model.add(Bidirectional(LSTM(50, activation='relu', return_sequences=True), input_shape=(seq_length, 1)))
    model.add(Bidirectional(LSTM(50, activation='relu')))
    model.add(Dense(1))
    model.compile(optimizer='adam', loss='mean_squared_error')

    # Train the model
    model.fit(X_train, y_train, epochs=100, batch_size=64, verbose=1)

    # Save the model
    model_file = f'{symbol}_model.h5'
    # if os.path.exists(model_file):
    #     os.remove(model_file)  # Delete the existing file
    
    model.save(model_file)
    print(f"Model saved as {model_file}")
