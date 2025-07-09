import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { AssignedMannequins } from './AssignedMannequins';
import { ClientAnalytics } from '@/components/analytics/ClientAnalytics';
import { ManagerSettings } from './ManagerSettings';

export function ManagerDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Manager Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user?.name}</p>
      </div>

      <Tabs defaultValue="mannequins" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="mannequins">Assigned Mannequins</TabsTrigger>
          <TabsTrigger value="analytics">Client Analytics</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="mannequins">
          <AssignedMannequins />
        </TabsContent>
        
        <TabsContent value="analytics">
          <ClientAnalytics />
        </TabsContent>
        
        <TabsContent value="settings">
          <ManagerSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
} 