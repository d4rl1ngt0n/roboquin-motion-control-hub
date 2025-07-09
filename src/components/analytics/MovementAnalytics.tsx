import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, Legend } from 'recharts';

const allMovementTrends = [
  { date: '2024-01-01', total: 1234, successful: 1198, failed: 36, storeId: 'storeA', mannequinId: 'MQ-001' },
  { date: '2024-01-02', total: 1456, successful: 1423, failed: 33, storeId: 'storeA', mannequinId: 'MQ-002' },
  { date: '2024-01-03', total: 1123, successful: 1098, failed: 25, storeId: 'storeB', mannequinId: 'MQ-003' },
  { date: '2024-01-04', total: 1567, successful: 1534, failed: 33, storeId: 'storeB', mannequinId: 'MQ-004' },
  { date: '2024-01-05', total: 1789, successful: 1756, failed: 33, storeId: 'storeD', mannequinId: 'MQ-005' },
  { date: '2024-01-06', total: 1345, successful: 1312, failed: 33, storeId: 'storeD', mannequinId: 'MQ-006' },
];

const allPopularPresets = [
  { name: 'Welcome Gesture', usage: 234, success: 97.5, storeId: 'storeA', mannequinId: 'MQ-001' },
  { name: 'Fashion Pose A', usage: 189, success: 96.8, storeId: 'storeB', mannequinId: 'MQ-003' },
  { name: 'Product Showcase', usage: 167, success: 98.2, storeId: 'storeD', mannequinId: 'MQ-005' },
  { name: 'Attention Getter', usage: 143, success: 95.1, storeId: 'storeF', mannequinId: 'MQ-007' },
  { name: 'Idle Breathing', usage: 892, success: 99.1, storeId: 'storeF', mannequinId: 'MQ-008' },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const total = payload[0].value + payload[1].value;
    const successRate = ((payload[0].value / total) * 100).toFixed(1);
    return (
      <div className="bg-white p-4 border rounded-lg shadow-lg">
        <p className="font-semibold">Date: {label}</p>
        <p className="text-green-600">Successful: {payload[0].value}</p>
        <p className="text-red-600">Failed: {payload[1].value}</p>
        <p className="text-blue-600">Total: {total}</p>
        <p className="text-gray-600">Success Rate: {successRate}%</p>
      </div>
    );
  }
  return null;
};

export function MovementAnalytics({ selectedStore, selectedMannequin }) {
  let movementTrends = allMovementTrends;
  let popularPresets = allPopularPresets;

  if (selectedStore && selectedStore !== 'all') {
    movementTrends = movementTrends.filter(d => d.storeId === selectedStore);
    popularPresets = popularPresets.filter(d => d.storeId === selectedStore);
  }
  if (selectedMannequin && selectedMannequin !== 'all') {
    movementTrends = movementTrends.filter(d => d.mannequinId === selectedMannequin);
    popularPresets = popularPresets.filter(d => d.mannequinId === selectedMannequin);
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Movement Success Rate Trends</CardTitle>
          <p className="text-sm text-gray-500">Daily breakdown of successful vs failed movements</p>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={movementTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  label={{ value: 'Date', position: 'insideBottom', offset: -5 }}
                />
                <YAxis 
                  label={{ value: 'Number of Movements', angle: -90, position: 'insideLeft' }}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="successful" 
                  stackId="1" 
                  stroke="#16a34a" 
                  fill="#16a34a" 
                  name="Successful Movements"
                />
                <Area 
                  type="monotone" 
                  dataKey="failed" 
                  stackId="1" 
                  stroke="#dc2626" 
                  fill="#dc2626" 
                  name="Failed Movements"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Popular Motion Presets</CardTitle>
          <p className="text-sm text-gray-500">Most frequently used movement presets and their success rates</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {popularPresets.map((preset, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50">
                <div>
                  <div className="font-medium">{preset.name}</div>
                  <div className="text-sm text-gray-600">
                    Used {preset.usage} times this week
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-bold ${
                    preset.success >= 98 ? 'text-green-600' :
                    preset.success >= 95 ? 'text-blue-600' :
                    preset.success >= 90 ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {preset.success}%
                  </div>
                  <div className="text-xs text-gray-500">Success Rate</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
