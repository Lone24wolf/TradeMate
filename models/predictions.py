import csv
import pandas as pd
import numpy as np
from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.models import load_model

# Function to read symbols from CSV file and return a list of symbols
dataframe = pd.read_csv('Cluster_labels.csv');
symbols = dataframe['Symbol'].tolist()
# print(symbols)
# Function to create sequences for LSTM
def create_sequences(data, seq_length):
    X = []
    for i in range(len(data) - seq_length):
        X.append(data[i : i + seq_length])
    return np.array(X)

# Path to your CSV file
csv_file_path = 'C:/Users/gaura/OneDrive/Desktop/Pr/models/cluster_labels.csv'

# Call the function to get the list of symbols
# symbol_list = read_symbols_from_csv(csv_file_path)

# Base path for saved models
models_path = 'C:/Users/gaura/OneDrive/Desktop/Pr/models/'
base_csv_path = 'C:/Users/gaura/pr/seperate Files/'
# Predictions for next 10 days
future_days = 10
all_predictions = []
seq_length = 50;
for symbol in symbols:
    # Load the model for this symbol
    model_path = f"{models_path}{symbol}_stock_lstm_model.keras"
    model = load_model(model_path)

    # Load the latest data for this symbol
    file_path = f"{base_csv_path}{symbol}.csv"
    df = pd.read_csv(file_path)
    
    # Select 'Open' feature
    data = df[['Open']].values

    # Normalize data
    scaler = MinMaxScaler(feature_range=(0, 1))
    scaled_data = scaler.fit_transform(data)

    # Take the last 50 days for prediction
    last_50_days = scaled_data[-30:]

    # Create sequences for the last 50 days
    # sequences = create_sequences(last_50_days, seq_length)

    # Reshape input data for LSTM

    # Make predictions for the next 'future_days' days
    predictions = []
    for _ in range(future_days):
        input_data = last_50_days.reshape((1, 30, 1))
        next_day_prediction = model.predict(input_data)[0][0]
        
        # Append the prediction to the predictions list
        predictions.append(next_day_prediction)
        
        # Update last_50_days to include the latest prediction and drop the oldest
        last_50_days = np.append(last_50_days[1:], [[next_day_prediction]], axis=0)
        
    # Inverse transform the predictions to get actual values
    predictions = scaler.inverse_transform(np.array(predictions).reshape(-1, 1))
    for prediction in predictions:
        all_predictions.append([symbol, prediction[0]])


    # # Print the predictions
    # print(f"Predictions for {symbol} for the next {future_days} days:")
    # for i, prediction in enumerate(predictions, 1):
    #     print(f"Day {i}: Predicted Open Price: {prediction[0]}")
df_predictions = pd.DataFrame(all_predictions, columns=['Symbol', 'Predicted_Price'])

# Save predictions to a CSV file
predictions_csv_file = 'predictions_10_days_2.csv'
df_predictions.to_csv(predictions_csv_file, index=False)

print("Predictions saved to", predictions_csv_file)

# df_predictions = pd.DataFrame(all_predictions)

# # Add columns for the day numbers
# day_numbers = range(1, future_days+1)
# df_predictions.insert(0, 'Day', day_numbers)

# # Save predictions to a CSV file
# predictions_csv_file = 'predictions_10_days.csv'
# df_predictions.to_csv(predictions_csv_file, index=False)

# print("Predictions saved to", predictions_csv_file)