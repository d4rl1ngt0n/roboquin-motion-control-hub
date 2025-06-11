
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export function UsageMetrics() {
  const hourlyData = [
    { hour: '00', movements: 12, active: 18 },
    { hour: '04', movements: 8, active: 14 },
    { hour: '08', movements: 45, active: 23 },
    { hour: '12', movements: 78, active: 24 },
    { hour: '16', movements: 92, active: 24 },
    { hour: '20', movements: 67, active: 22 },
  ];

  const customerData = [
    { name: 'Fashion Retailer Inc.', value: 35, color: '#2563eb' },
    { name: 'Trendy Boutique', value: 25, color: '#dc2626' },
    { name: 'Urban Wear Co.', value: 20, color: '#16a34a' },
    { name: 'Luxury Fashion', value: 15, color: '#ca8a04' },
    { name: 'Style Central', value: 5, color: '#9333ea' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Hourly Movement Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="movements" fill="#2563eb" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Usage by Customer</CardTitle>
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
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
