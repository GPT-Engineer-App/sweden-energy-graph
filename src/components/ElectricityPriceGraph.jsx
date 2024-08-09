import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useQuery } from '@tanstack/react-query';

const API_BASE_URL = 'https://www.nordpoolgroup.com/api/marketdata/page/10';

const fetchElectricityPrices = async (timeRange) => {
  const today = new Date();
  const endDate = today.toISOString().split('T')[0];
  let startDate;

  switch (timeRange) {
    case '7d':
      startDate = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      break;
    case '30d':
      startDate = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      break;
    case '90d':
      startDate = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      break;
    default:
      throw new Error('Invalid time range');
  }
  
  const url = `${API_BASE_URL}?currency=SEK,SEK,SEK,SEK&endDate=${endDate}&startDate=${startDate}`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch data');
    }
    const data = await response.json();
  
    // Process the data to extract prices for SE3 (Stockholm area)
    return data.data.Rows
      .filter(row => row.IsExtraRow === false)
      .map(row => ({
        date: row.StartTime.split('T')[0],
        price: parseFloat(row.Columns.find(col => col.Name === 'SE3').Value.replace(',', '.'))
      }));
  } catch (error) {
    console.error('Error fetching electricity prices:', error);
    throw error;
  }
};

const ElectricityPriceGraph = () => {
  const [timeRange, setTimeRange] = useState('7d'); // Default to 7 days

  const { data, isLoading, error } = useQuery({
    queryKey: ['electricityPrices', timeRange],
    queryFn: () => fetchElectricityPrices(timeRange),
    refetchInterval: 24 * 60 * 60 * 1000, // Refetch every 24 hours
  });

  return (
    <div className="w-full max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Electricity Spot Prices in Sweden</h2>
      <div className="mb-4">
        <button
          className={`mr-2 px-4 py-2 rounded ${timeRange === '7d' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setTimeRange('7d')}
        >
          7 Days
        </button>
        <button
          className={`mr-2 px-4 py-2 rounded ${timeRange === '30d' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setTimeRange('30d')}
        >
          30 Days
        </button>
        <button
          className={`px-4 py-2 rounded ${timeRange === '90d' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setTimeRange('90d')}
        >
          90 Days
        </button>
      </div>
      {isLoading ? (
        <div className="text-center py-10">Loading electricity price data...</div>
      ) : error ? (
        <div className="text-center py-10 text-red-500">Error loading data: {error.message}</div>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="price" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default ElectricityPriceGraph;
