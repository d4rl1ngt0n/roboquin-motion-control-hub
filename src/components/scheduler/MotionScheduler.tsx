
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Plus } from 'lucide-react';
import { ScheduleCalendar } from './ScheduleCalendar';
import { ScheduleForm } from './ScheduleForm';

export function MotionScheduler() {
  const [showForm, setShowForm] = useState(false);

  const upcomingSchedules = [
    {
      id: 1,
      device: 'MQ-001',
      preset: 'Welcome Gesture',
      time: '09:00 AM',
      date: 'Today',
      recurring: 'Daily'
    },
    {
      id: 2,
      device: 'MQ-002',
      preset: 'Fashion Pose A',
      time: '02:30 PM',
      date: 'Today',
      recurring: 'Weekdays'
    },
    {
      id: 3,
      device: 'MQ-004',
      preset: 'Product Showcase',
      time: '06:00 PM',
      date: 'Tomorrow',
      recurring: 'Once'
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Motion Scheduler</h1>
        <p className="text-gray-600">Schedule automated movements and routines for your mannequins</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Schedule Calendar */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Schedule Calendar</CardTitle>
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Schedule
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ScheduleCalendar />
            </CardContent>
          </Card>
        </div>

        {/* Upcoming Schedules */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Schedules</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingSchedules.map((schedule) => (
                <div key={schedule.id} className="p-3 border rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span className="font-semibold">{schedule.time}</span>
                  </div>
                  
                  <div className="text-sm space-y-1">
                    <div className="font-medium">{schedule.preset}</div>
                    <div className="text-gray-600">{schedule.device}</div>
                    <div className="flex gap-2">
                      <Badge variant="outline">{schedule.date}</Badge>
                      <Badge variant="secondary">{schedule.recurring}</Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {showForm && (
        <ScheduleForm onClose={() => setShowForm(false)} />
      )}
    </div>
  );
}
