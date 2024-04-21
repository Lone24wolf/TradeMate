import csv
import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense
from tensorflow.keras.callbacks import ModelCheckpoint
# Function to read symbols from CSV file and return a list of symbols
def read_symbols_from_csv(csv_file):
    symbols = []
    with open(csv_file, mode='r') as file:
        csv_reader = csv.DictReader(file)
        for row in csv_reader:
            symbols.append(row['Symbol'])
    return symbols

# Path to your CSV file
csv_file_path = 'C:/Users/gaura/OneDrive/Desktop/Pr/models/cluster_labels.csv'

# Call the function to get the list of symbols
symbol_list = read_symbols_from_csv(csv_file_path)

# Print the list of symbols
print("List of Symbols:", symbol_list)

base_csv_path = 'C:/Users/gaura/pr/seperate Files/'
# Load CSV file
k=0;
for symbol in symbol_list:
    file_path = f"{base_csv_path}{symbol}.csv"  # Using f-string to insert symbol into path
    df = pd.read_csv(file_path)
    
    # Do something with the DataFrame 'df' for each symbol
    # print(f"Data for symbol {symbol}:")
    # print(df.head())
    # print("-------------------------")

    # Select 'Open' feature
    data = df[['Open']].values

    # Normalize data
    scaler = MinMaxScaler(feature_range=(0, 1))
    scaled_data = scaler.fit_transform(data)

    # Function to create sequences for LSTM
    def create_sequences(data, seq_length):
        X, y = [], []
        for i in range(len(data) - seq_length):
            X.append(data[i : i + seq_length])
            y.append(data[i + seq_length])
        return np.array(X), np.array(y)

    # Define sequence length
    seq_length = 50

    # Create sequences
    X, y = create_sequences(scaled_data, seq_length)

    # Split the data
    split_ratio = 0.8
    split = int(split_ratio * len(X))
    X_train, X_test = X[:split], X[split:]
    y_train, y_test = y[:split], y[split:]

    # Reshape input data for LSTM
    X_train = X_train.reshape((X_train.shape[0], X_train.shape[1], 1))
    X_test = X_test.reshape((X_test.shape[0], X_test.shape[1], 1))

    # Build LSTM model
    model = Sequential()
    model.add(LSTM(50, activation='relu', input_shape=(seq_length, 1)))
    model.add(Dense(1))
    model.compile(optimizer='adam', loss='mean_squared_error')

    # Checkpoint to save the best model
    checkpoint_filepath = 'best_model.keras'
    checkpoint = ModelCheckpoint(checkpoint_filepath, monitor='val_loss', save_best_only=True, mode='min', verbose=1)

    # Train the model
    model.fit(X_train, y_train, epochs=100, batch_size=64, verbose=1, validation_data=(X_test, y_test), callbacks=[checkpoint])

    # Save the model
    model.save(f'{symbol}_stock_lstm_model.keras')
    print("Model saved as stock_lstm_model.keras")
    print(k)
    k=k+1

