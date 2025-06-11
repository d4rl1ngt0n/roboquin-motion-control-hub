
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export function AnalyticsChart() {
  const data = [
    { time: '00:00', movements: 12, active: 18 },
    { time: '04:00', movements: 8, active: 14 },
    { time: '08:00', movements: 45, active: 23 },
    { time: '12:00', movements: 78, active: 24 },
    { time: '16:00', movements: 92, active: 24 },
    { time: '20:00', movements: 67, active: 22 },
    { time: '23:59', movements: 34, active: 19 },
  ];

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line 
            type="monotone" 
            dataKey="movements" 
            stroke="#2563eb" 
            strokeWidth={2}
            name="Movements"
          />
          <Line 
            type="monotone" 
            dataKey="active" 
            stroke="#dc2626" 
            strokeWidth={2}
            name="Active Devices"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
