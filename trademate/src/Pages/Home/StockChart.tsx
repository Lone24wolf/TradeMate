import React, { useState, useEffect } from 'react';
import Plot from 'react-plotly.js';
import axios from 'axios';

const API_KEY = 'UpHUFhjWSvIcDPCANN3V7PmMu4YYyCJD';

interface StockDatum {
  date: string;
  close: number;
}

interface Props {
  ticker: string;
}

const StockChart: React.FC<Props> = ({ ticker }) => {
  const [stockData, setStockData] = useState<StockDatum[]>([]);
  const [livePrice, setLivePrice] = useState<number | null>(null);
  const [increaseFromLastDay, setIncreaseFromLastDay] = useState<number | null>(null);
  const [color, setColor] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const endDate = new Date(); // Current date
        const startDate = new Date();
        startDate.setMonth(startDate.getMonth() - 1); // One month ago
        
        // Format the start and end dates as YYYY-MM-DD
        const formattedStartDate = startDate.toISOString().split('T')[0];
        const formattedEndDate = endDate.toISOString().split('T')[0];
        
        // Make API request for the last one month data
        const response = await axios.get(`https://financialmodelingprep.com/api/v3/historical-price-full/${ticker}?from=${formattedStartDate}&to=${formattedEndDate}&apikey=${API_KEY}`);
        
        // Extract the data
        if (response.data.historical && response.data.historical.length > 0) {
          setStockData(response.data.historical);
        } else {
          console.log('No data available for the last one month');
        }
      } catch (error) {
        console.error('Error fetching stock data:', error);
      }
    };

    fetchData();
  }, [ticker]);

  useEffect(() => {
    const fetchLivePrice = async () => {
      try {
        const response = await axios.get(`https://financialmodelingprep.com/api/v3/quote/${ticker}?apikey=${API_KEY}`);
        setLivePrice(response.data[0].price);
      } catch (error) {
        console.error('Error fetching live price:', error);
      }
    };

    const intervalId = setInterval(fetchLivePrice, 200000);

    fetchLivePrice();

    return () => clearInterval(intervalId);
  }, [ticker]);

  useEffect(() => {
    if (stockData.length > 0 && livePrice !== null) {
      const lastDayClose = stockData[1].close;
      const increase = livePrice - lastDayClose;
      setIncreaseFromLastDay(increase);
      setColor(increase >= 0 ? 'green' : 'red');
    }
  }, [stockData, livePrice]);
  console.log(stockData[0])
  const x = stockData.map((datum) => new Date(datum.date).toLocaleDateString());
  const y = stockData.map((datum) => datum.close);
  console.log(x)
  console.log(y)
  return (
    <div style={{display:'flex',justifyContent:'space-evenly', border: '1px solid black', padding: '10px' }}>
      <h2>{ticker}</h2>
      <Plot 
        data={[
            {
                x,
                y,
                type: 'scatter',
                mode: 'lines',
                marker: { color },
            },
        ]}
        layout={{
            showlegend: false, // Hides legend
            xaxis: { showgrid: false, zeroline: false, title: '', tickvals: [], ticktext: [] }, // Hide x-axis values
            yaxis: { showgrid: false, zeroline: false, title: '', tickvals: [], ticktext: [] }, // Hide y-axis values
            height: 100,
            width: 160,
            plot_bgcolor: '#100b22', // Background color of the plot
            paper_bgcolor: 'lightgray', // Background color of the paper
            margin: { t: 0, b: 0, l: 0, r: 0 }, // Adjust margin for more zoom
        }}
        config={{ displayModeBar: false }}
      />
        <p>${livePrice?.toFixed(2)}</p>
        <p style={{ color }}>${increaseFromLastDay?.toFixed(2)}</p>
    </div>
  );
};

export default StockChart;
