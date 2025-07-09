import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Plus, Trash2, Edit, DollarSign, Info } from 'lucide-react';
import { ScheduleCalendar } from './ScheduleCalendar';
import { ScheduleForm } from './ScheduleForm';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { getSchedules, createSchedule, updateSchedule, deleteSchedule } from '@/api/schedules';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Mannequin {
  id: string;
  name: string;
  location: string;
}

interface Schedule {
  id: number;
  device: string;
  preset: string;
  time: string;
  date: string;
  recurring: string;
  status: 'active' | 'completed' | 'cancelled';
}

interface MotionSchedulerProps {
  mannequins?: Mannequin[];
}

export function MotionScheduler({ mannequins }: MotionSchedulerProps) {
  const [showForm, setShowForm] = useState(false);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);
  const { user } = useAuth();

  // Load schedules on component mount
  useEffect(() => {
    loadSchedules();
  }, []);

  const loadSchedules = async () => {
    try {
      const data = await getSchedules();
      setSchedules(data);
    } catch (error) {
      console.error('Failed to load schedules:', error);
      toast.error('Failed to load schedules');
    }
  };

  // Filter schedules based on user role and assigned mannequins
  const getFilteredSchedules = () => {
    if (user.role === 'admin') {
      return schedules;
    }

    // For client and manager roles, filter schedules based on assigned mannequins
    return schedules.filter(schedule => 
      mannequins?.some(m => m.id === schedule.device)
    );
  };

  const handleCreateSchedule = async (newSchedule: Omit<Schedule, 'id'>) => {
    try {
      // Check monthly scheduling limit for non-admin users
      if (user.role !== 'admin') {
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        const monthlySchedules = schedules.filter(schedule => {
          const scheduleDate = new Date(schedule.date);
          return scheduleDate.getMonth() === currentMonth && 
                 scheduleDate.getFullYear() === currentYear;
        });
        
        if (monthlySchedules.length >= 1) {
          toast.error('Monthly scheduling limit reached. You can only schedule once per month.');
          return;
        }
      }
      
      const createdSchedule = await createSchedule(newSchedule);
      setSchedules(prev => [...prev, createdSchedule]);
      toast.success('Schedule created successfully');
      setShowForm(false);
    } catch (error) {
      console.error('Failed to create schedule:', error);
      toast.error('Failed to create schedule');
    }
  };

  const handleEditSchedule = async (scheduleId: number, updatedSchedule: Partial<Schedule>) => {
    try {
      const updated = await updateSchedule(scheduleId, updatedSchedule);
      setSchedules(prev => prev.map(s => s.id === scheduleId ? updated : s));
      toast.success('Schedule updated successfully');
      setEditingSchedule(null);
    } catch (error) {
      console.error('Failed to update schedule:', error);
      toast.error('Failed to update schedule');
    }
  };

  const handleDeleteSchedule = async (scheduleId: number) => {
    try {
      await deleteSchedule(scheduleId);
      setSchedules(prev => prev.filter(s => s.id !== scheduleId));
      toast.success('Schedule deleted successfully');
    } catch (error) {
      console.error('Failed to delete schedule:', error);
      toast.error('Failed to delete schedule');
    }
  };

  const upcomingSchedules = getFilteredSchedules();

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
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <CardTitle>Schedule Calendar</CardTitle>
                  <Badge variant="secondary" className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0">
                    <DollarSign className="h-3 w-3 mr-1" />
                    Paid Feature
                  </Badge>
                </div>
                <Button onClick={() => setShowForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  New Schedule
                </Button>
              </div>
              <div className="mt-2 flex items-center gap-2">
                <Info className="h-4 w-4 text-blue-500" />
                <span className="text-xs text-blue-700 font-medium">Free users can only schedule Once a Month</span>
              </div>
            </CardHeader>
            <CardContent>
              <ScheduleCalendar schedules={upcomingSchedules} />
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
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span className="font-semibold">{schedule.time}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingSchedule(schedule)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteSchedule(schedule.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="text-sm space-y-1">
                    <div className="font-medium">{schedule.preset}</div>
                    <div className="text-gray-600">{schedule.device}</div>
                    <div className="flex gap-2">
                      <Badge variant="outline">{schedule.date}</Badge>
                      <Badge variant="secondary">{schedule.recurring}</Badge>
                      <Badge 
                        variant={schedule.status === 'active' ? 'default' : 'secondary'}
                      >
                        {schedule.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showForm || !!editingSchedule} onOpenChange={(open) => {
        if (!open) {
          setShowForm(false);
          setEditingSchedule(null);
        }
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingSchedule ? 'Edit Schedule' : 'New Schedule'}</DialogTitle>
          </DialogHeader>
          <ScheduleForm 
            mannequins={mannequins || []}
            presets={[
              { id: 'welcome', name: 'Welcome Gesture' },
              { id: 'fashion-a', name: 'Fashion Pose A' },
              { id: 'fashion-b', name: 'Fashion Pose B' },
              { id: 'dance', name: 'Dance Routine' }
            ]}
            onSuccess={() => {
              setShowForm(false);
              setEditingSchedule(null);
              loadSchedules();
            }}
            initialData={editingSchedule || undefined}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
