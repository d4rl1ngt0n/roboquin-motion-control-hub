import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const allHourlyData = [
  { hour: '00', movements: 12, active: 18, storeId: 'storeA', mannequinId: 'MQ-001' },
  { hour: '04', movements: 8, active: 14, storeId: 'storeA', mannequinId: 'MQ-002' },
  { hour: '08', movements: 45, active: 23, storeId: 'storeB', mannequinId: 'MQ-003' },
  { hour: '12', movements: 78, active: 24, storeId: 'storeB', mannequinId: 'MQ-004' },
  { hour: '16', movements: 92, active: 24, storeId: 'storeD', mannequinId: 'MQ-005' },
  { hour: '20', movements: 67, active: 22, storeId: 'storeD', mannequinId: 'MQ-006' },
];

const allCustomerData = [
  { name: 'Store A', value: 35, color: '#2563eb', storeId: 'storeA' },
  { name: 'Store B', value: 25, color: '#dc2626', storeId: 'storeB' },
  { name: 'Store D', value: 20, color: '#16a34a', storeId: 'storeD' },
  { name: 'Store F', value: 15, color: '#ca8a04', storeId: 'storeF' },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border rounded-lg shadow-lg">
        <p className="font-semibold">Hour: {label}:00</p>
        <p className="text-blue-600">Movements: {payload[0].value}</p>
        <p className="text-green-600">Active Time: {payload[1]?.value || 0} min</p>
      </div>
    );
  }
  return null;
};

export function UsageMetrics({ selectedStore, selectedMannequin }) {
  let hourlyData = allHourlyData;
  let customerData = allCustomerData;

  if (selectedStore && selectedStore !== 'all') {
    hourlyData = hourlyData.filter(d => d.storeId === selectedStore);
    customerData = customerData.filter(d => d.storeId === selectedStore);
  }
  if (selectedMannequin && selectedMannequin !== 'all') {
    hourlyData = hourlyData.filter(d => d.mannequinId === selectedMannequin);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Hourly Movement Activity</CardTitle>
          <p className="text-sm text-gray-500">Number of movements and active time per hour</p>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="hour" 
                  label={{ value: 'Hour of Day', position: 'insideBottom', offset: -5 }} 
                />
                <YAxis 
                  yAxisId="left"
                  label={{ value: 'Number of Movements', angle: -90, position: 'insideLeft' }} 
                />
                <YAxis 
                  yAxisId="right" 
                  orientation="right"
                  label={{ value: 'Active Time (min)', angle: 90, position: 'insideRight' }} 
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar yAxisId="left" dataKey="movements" fill="#2563eb" name="Movements" />
                <Bar yAxisId="right" dataKey="active" fill="#16a34a" name="Active Time" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Usage Distribution by Store</CardTitle>
          <p className="text-sm text-gray-500">Percentage of total mannequin usage across stores</p>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={customerData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {customerData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`${value}% of total usage`, 'Store Usage']}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
