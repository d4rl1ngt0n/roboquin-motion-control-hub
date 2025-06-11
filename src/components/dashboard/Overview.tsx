
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Monitor, Activity, Users, Bell } from 'lucide-react';
import { LiveStatusGrid } from '@/components/dashboard/LiveStatusGrid';
import { AnalyticsChart } from '@/components/dashboard/AnalyticsChart';
import { RecentActivity } from '@/components/dashboard/RecentActivity';

export function Overview() {
  const stats = [
    { title: 'Active Mannequins', value: '24', change: '+12%', icon: Monitor },
    { title: 'Total Movements Today', value: '1,247', change: '+23%', icon: Activity },
    { title: 'Registered Users', value: '56', change: '+8%', icon: Users },
    { title: 'Active Alerts', value: '3', change: '-5%', icon: Bell },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-600">Monitor your IoT mannequin network in real-time</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-5 w-5 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <p className="text-xs text-green-600">{stat.change} from last month</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>System Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <AnalyticsChart />
            </CardContent>
          </Card>
        </div>
        
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <RecentActivity />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Live Status Grid */}
      <Card>
        <CardHeader>
          <CardTitle>Live Mannequin Status</CardTitle>
        </CardHeader>
        <CardContent>
          <LiveStatusGrid />
        </CardContent>
      </Card>
    </div>
  );
}
