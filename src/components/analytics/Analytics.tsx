
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { UsageMetrics } from './UsageMetrics';
import { SystemHealth } from './SystemHealth';
import { MovementAnalytics } from './MovementAnalytics';

export function Analytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600">Comprehensive insights into your mannequin network performance</p>
      </div>

      <Tabs defaultValue="usage" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="usage">Usage Metrics</TabsTrigger>
          <TabsTrigger value="health">System Health</TabsTrigger>
          <TabsTrigger value="movements">Movement Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="usage">
          <UsageMetrics />
        </TabsContent>
        
        <TabsContent value="health">
          <SystemHealth />
        </TabsContent>
        
        <TabsContent value="movements">
          <MovementAnalytics />
        </TabsContent>
      </Tabs>
    </div>
  );
}
