import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useQuery } from '@tanstack/react-query';

const fetchElectricityPrices = async () => {
  // This is a placeholder URL. Replace with the actual API endpoint
  const response = await fetch('https://api.example.com/electricity-prices');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const ElectricityPriceGraph = () => {
  const [timeRange, setTimeRange] = useState('7d'); // Default to 7 days

  const { data, isLoading, error } = useQuery({
    queryKey: ['electricityPrices', timeRange],
    queryFn: fetchElectricityPrices,
    refetchInterval: 24 * 60 * 60 * 1000, // Refetch every 24 hours
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

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
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="price" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ElectricityPriceGraph;
