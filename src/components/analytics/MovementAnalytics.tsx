
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

export function MovementAnalytics() {
  const movementTrends = [
    { date: '2024-01-01', total: 1234, successful: 1198, failed: 36 },
    { date: '2024-01-02', total: 1456, successful: 1423, failed: 33 },
    { date: '2024-01-03', total: 1123, successful: 1098, failed: 25 },
    { date: '2024-01-04', total: 1567, successful: 1534, failed: 33 },
    { date: '2024-01-05', total: 1789, successful: 1756, failed: 33 },
    { date: '2024-01-06', total: 1345, successful: 1312, failed: 33 },
    { date: '2024-01-07', total: 1678, successful: 1645, failed: 33 },
  ];

  const popularPresets = [
    { name: 'Welcome Gesture', usage: 234, success: 97.5 },
    { name: 'Fashion Pose A', usage: 189, success: 96.8 },
    { name: 'Product Showcase', usage: 167, success: 98.2 },
    { name: 'Attention Getter', usage: 143, success: 95.1 },
    { name: 'Idle Breathing', usage: 892, success: 99.1 },
  ];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Movement Success Rate Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={movementTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="successful" stackId="1" stroke="#16a34a" fill="#16a34a" />
                <Area type="monotone" dataKey="failed" stackId="1" stroke="#dc2626" fill="#dc2626" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Popular Motion Presets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {popularPresets.map((preset, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">{preset.name}</div>
                  <div className="text-sm text-gray-600">Used {preset.usage} times this week</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600">{preset.success}%</div>
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
