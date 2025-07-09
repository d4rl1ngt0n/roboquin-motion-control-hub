import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

interface HourlyStat {
  hour: string;
  entries: number;
  exits: number;
}

const AnalyticsChart: React.FC<{ data: HourlyStat[] }> = ({ data }) => (
  <div style={{ width: '100%', height: 300 }}>
    <ResponsiveContainer>
      <BarChart data={data} margin={{ top: 16, right: 16, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="hour" />
        <YAxis allowDecimals={false} />
        <Tooltip />
        <Legend />
        <Bar dataKey="entries" fill="#4f8cff" name="Entries" />
        <Bar dataKey="exits" fill="#ff6b6b" name="Exits" />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default AnalyticsChart; 