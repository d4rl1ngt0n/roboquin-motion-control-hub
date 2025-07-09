import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const allInteractionData = [
  { mannequin: 'MQ-001', avgDuration: 12, storeId: 'storeA' },
  { mannequin: 'MQ-002', avgDuration: 8, storeId: 'storeA' },
  { mannequin: 'MQ-003', avgDuration: 15, storeId: 'storeB' },
  { mannequin: 'MQ-004', avgDuration: 6, storeId: 'storeB' },
  { mannequin: 'MQ-005', avgDuration: 10, storeId: 'storeD' },
  { mannequin: 'MQ-006', avgDuration: 7, storeId: 'storeD' },
];

const allMovementAttentionData = [
  { name: 'Welcome Gesture', value: 120, storeId: 'storeA' },
  { name: 'Fashion Pose A', value: 95, storeId: 'storeB' },
  { name: 'Product Showcase', value: 80, storeId: 'storeD' },
  { name: 'Idle Breathing', value: 60, storeId: 'storeF' },
  { name: 'Attention Getter', value: 140, storeId: 'storeF' },
];

const COLORS = ['#2563eb', '#dc2626', '#16a34a', '#ca8a04', '#9333ea'];

const DurationTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border rounded-lg shadow-lg">
        <p className="font-semibold">Mannequin: {label}</p>
        <p className="text-blue-600">Average Duration: {payload[0].value} minutes</p>
      </div>
    );
  }
  return null;
};

const AttentionTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border rounded-lg shadow-lg">
        <p className="font-semibold">Movement: {label}</p>
        <p className="text-blue-600">Attention Score: {payload[0].value}</p>
        <p className="text-gray-500 text-sm">Higher score indicates more customer engagement</p>
      </div>
    );
  }
  return null;
};

export function UserEngagementAnalytics({ selectedStore, selectedMannequin }) {
  let interactionData = allInteractionData;
  let movementAttentionData = allMovementAttentionData;

  if (selectedStore && selectedStore !== 'all') {
    interactionData = interactionData.filter(d => d.storeId === selectedStore);
    movementAttentionData = movementAttentionData.filter(d => d.storeId === selectedStore);
  }
  if (selectedMannequin && selectedMannequin !== 'all') {
    interactionData = interactionData.filter(d => d.mannequin === selectedMannequin);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Average User Interaction Duration</CardTitle>
          <p className="text-sm text-gray-500">Time spent by customers interacting with each mannequin</p>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={interactionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="mannequin" 
                  label={{ value: 'Mannequin ID', position: 'insideBottom', offset: -5 }}
                />
                <YAxis 
                  label={{ value: 'Duration (minutes)', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip content={<DurationTooltip />} />
                <Legend />
                <Bar 
                  dataKey="avgDuration" 
                  fill="#2563eb" 
                  name="Average Duration (min)"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Movement Attention Analysis</CardTitle>
          <p className="text-sm text-gray-500">Relative effectiveness of different movement types in capturing customer attention</p>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={movementAttentionData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {movementAttentionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<AttentionTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 