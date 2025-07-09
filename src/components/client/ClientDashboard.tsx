import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { MannequinList } from './MannequinList';
import { ClientAnalytics } from '@/components/analytics/ClientAnalytics';
import { ClientSettings } from './ClientSettings';

export function ClientDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Client Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.name}</p>
      </div>

      <Tabs defaultValue="mannequins" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="mannequins">My Mannequins</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="mannequins">
          <MannequinList />
        </TabsContent>
        
        <TabsContent value="analytics">
          <ClientAnalytics />
        </TabsContent>
        
        <TabsContent value="settings">
          <ClientSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
} 