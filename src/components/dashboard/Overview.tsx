import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Monitor, 
  Activity, 
  Users, 
  Bell, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  Target,
  Sparkles,
  Lightbulb,
  BarChart3,
  PieChart,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Zap
} from 'lucide-react';
import { LiveStatusGrid } from '@/components/dashboard/LiveStatusGrid';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { MannequinDetailsModal } from '@/components/mannequins/MannequinDetailsModal';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart as RechartsPieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { useNavigate } from 'react-router-dom';

export interface OverviewMannequin {
  id: string;
  name: string;
  status: string;
  store?: string;
  clientId?: string;
  battery?: number;
  lastSeen?: string;
}

interface OverviewProps {
  mannequins: OverviewMannequin[];
  showRegisteredUsersStat?: boolean;
}

export function Overview({ mannequins, showRegisteredUsersStat = true }: OverviewProps) {
  const [selectedMannequin, setSelectedMannequin] = useState<OverviewMannequin | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();

  // Update time every minute
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Group mannequins by store
  const stores = Array.from(new Set(mannequins.map(m => m.store || 'Unknown')));
  
  // Calculate key metrics
  const totalMannequins = mannequins.length;
  const activeMannequins = mannequins.filter(m => m.status === 'online').length;
  const offlineMannequins = mannequins.filter(m => m.status === 'offline').length;
  const maintenanceMannequins = mannequins.filter(m => m.status === 'maintenance').length;
  const uptimePercentage = totalMannequins > 0 ? (activeMannequins / totalMannequins) * 100 : 0;

  // Mock data for charts
  const hourlyActivityData = [
    { hour: '09:00', movements: 45, interactions: 23, storeId: 'storeA' },
    { hour: '10:00', movements: 67, interactions: 34, storeId: 'storeA' },
    { hour: '11:00', movements: 89, interactions: 45, storeId: 'storeA' },
    { hour: '12:00', movements: 123, interactions: 67, storeId: 'storeA' },
    { hour: '13:00', movements: 98, interactions: 52, storeId: 'storeA' },
    { hour: '14:00', movements: 76, interactions: 38, storeId: 'storeA' },
    { hour: '15:00', movements: 112, interactions: 58, storeId: 'storeA' },
    { hour: '16:00', movements: 134, interactions: 72, storeId: 'storeA' },
    { hour: '17:00', movements: 87, interactions: 44, storeId: 'storeA' },
    { hour: '18:00', movements: 56, interactions: 28, storeId: 'storeA' },
  ];

  const weeklyPerformanceData = [
    { day: 'Mon', engagement: 85, efficiency: 92, storeId: 'storeA' },
    { day: 'Tue', engagement: 78, efficiency: 88, storeId: 'storeA' },
    { day: 'Wed', engagement: 92, efficiency: 95, storeId: 'storeA' },
    { day: 'Thu', engagement: 88, efficiency: 90, storeId: 'storeA' },
    { day: 'Fri', engagement: 95, efficiency: 93, storeId: 'storeA' },
    { day: 'Sat', engagement: 98, efficiency: 96, storeId: 'storeA' },
    { day: 'Sun', engagement: 82, efficiency: 89, storeId: 'storeA' },
  ];

  const storePerformanceData = stores.map(store => ({
    name: store,
    value: mannequins.filter(m => m.store === store).length,
    color: `hsl(${Math.random() * 360}, 70%, 50%)`
  }));

  const aiInsights = [
    {
      type: 'positive',
      icon: TrendingUp,
      title: 'Excellent Performance Today',
      description: 'Your mannequins are performing 23% better than yesterday. The "Welcome Gesture" preset is particularly effective during peak hours.',
      metric: '+23%',
      color: 'text-green-600'
    },
    {
      type: 'info',
      icon: Lightbulb,
      title: 'Optimization Opportunity',
      description: 'Store A shows 15% higher engagement during 2-4 PM. Consider scheduling more dynamic movements during this window.',
      metric: '15%',
      color: 'text-blue-600'
    },
    {
      type: 'warning',
      icon: AlertTriangle,
      title: 'Maintenance Alert',
      description: 'MQ-003 battery is at 15%. Schedule maintenance within 48 hours to ensure uninterrupted service.',
      metric: '15%',
      color: 'text-yellow-600'
    }
  ];

  const quickActions = [
    { name: 'Schedule Motion', icon: Calendar, action: () => navigate('/dashboard/client/scheduler') },
    { name: 'View Analytics', icon: BarChart3, action: () => navigate('/dashboard/client/analytics') },
    { name: 'Check Status', icon: Monitor, action: () => navigate('/dashboard/client/mannequins') },
    { name: 'Get Support', icon: Users, action: () => navigate('/dashboard/client/chat') },
  ];

  const stats = [
    { 
      title: 'Active Mannequins', 
      value: activeMannequins, 
      total: totalMannequins,
      change: '+12%', 
      icon: Monitor,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    { 
      title: 'Total Movements Today', 
      value: 1247, 
      change: '+23%', 
      icon: Activity,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    { 
      title: 'Customer Interactions', 
      value: 892, 
      change: '+18%', 
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    { 
      title: 'System Uptime', 
      value: `${uptimePercentage.toFixed(1)}%`, 
      change: '+2.1%', 
      icon: Zap,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-100 text-green-800';
      case 'offline': return 'bg-red-100 text-red-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back! 👋</h1>
            <p className="text-blue-100 text-lg">
              Your fashion assistants are working perfectly today. Here's what's happening across your stores.
            </p>
            <p className="text-blue-200 text-sm mt-2">
              Last updated: {currentTime.toLocaleTimeString()}
            </p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold">{activeMannequins}/{totalMannequins}</div>
            <div className="text-blue-200">Mannequins Active</div>
          </div>
        </div>
      </div>

      {/* AI Insights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {aiInsights.map((insight, index) => (
          <Card key={index} className="border-l-4 border-l-green-500 hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-full ${insight.color.replace('text-', 'bg-').replace('-600', '-100')}`}>
                  <insight.icon className={`h-5 w-5 ${insight.color}`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-sm">{insight.title}</h3>
                    <Badge variant="outline" className="text-xs">{insight.metric}</Badge>
                  </div>
                  <p className="text-sm text-gray-600">{insight.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-full ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              {stat.total && (
                <Progress value={(activeMannequins / totalMannequins) * 100} className="mt-2" />
              )}
              <p className="text-xs text-green-600 mt-1">{stat.change} from last month</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-20 flex flex-col gap-2 hover:bg-purple-50 hover:border-purple-200"
                onClick={action.action}
              >
                <action.icon className="h-6 w-6 text-purple-600" />
                <span className="text-sm font-medium">{action.name}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Hourly Activity Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Today's Activity Pattern
            </CardTitle>
            <p className="text-sm text-gray-500">Movement and interaction trends throughout the day</p>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={hourlyActivityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="movements" stackId="1" stroke="#3b82f6" fill="#3b82f6" name="Movements" />
                  <Area type="monotone" dataKey="interactions" stackId="1" stroke="#8b5cf6" fill="#8b5cf6" name="Interactions" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Weekly Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Weekly Performance
            </CardTitle>
            <p className="text-sm text-gray-500">Engagement and efficiency metrics</p>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="engagement" stroke="#10b981" strokeWidth={3} name="Engagement %" />
                  <Line type="monotone" dataKey="efficiency" stroke="#3b82f6" strokeWidth={3} name="Efficiency %" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Store Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChart className="h-5 w-5 text-orange-600" />
            Mannequin Distribution by Store
          </CardTitle>
          <p className="text-sm text-gray-500">How your fashion assistants are distributed across locations</p>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={storePerformanceData}
                  cx="50%"
                  cy="50%"
                  outerRadius={120}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {storePerformanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Live Status Grid, grouped by store */}
      {stores.map(store => (
        <Card key={store} className="mt-4">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5 text-blue-600" />
              Live Status - {store}
            </CardTitle>
            <p className="text-sm text-gray-500">Real-time status of your fashion assistants</p>
          </CardHeader>
          <CardContent>
            <LiveStatusGrid 
              mannequins={mannequins.filter(m => (m.store || 'Unknown') === store)}
              onViewDetails={(mannequin) => { setSelectedMannequin(mannequin); setModalOpen(true); }}
            />
          </CardContent>
        </Card>
      ))}

      {/* Mannequin Details Modal */}
      <MannequinDetailsModal mannequin={selectedMannequin} open={modalOpen} onOpenChange={setModalOpen} />
    </div>
  );
}
