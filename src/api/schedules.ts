import { toast } from 'sonner';

interface Schedule {
  id: number;
  device: string;
  preset: string;
  time: string;
  date: string;
  recurring: string;
  status: 'active' | 'completed' | 'cancelled';
}

// Mock data store (replace with actual API calls in production)
let schedules: Schedule[] = [
  {
    id: 1,
    device: 'MQ-001',
    preset: 'Welcome Gesture',
    time: '09:00 AM',
    date: '2024-03-20',
    recurring: 'Daily',
    status: 'active'
  },
  {
    id: 2,
    device: 'MQ-002',
    preset: 'Fashion Pose A',
    time: '02:30 PM',
    date: '2024-03-20',
    recurring: 'Weekdays',
    status: 'active'
  }
];

// Get all schedules
export const getSchedules = async (): Promise<Schedule[]> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return schedules;
  } catch (error) {
    console.error('Failed to fetch schedules:', error);
    throw new Error('Failed to fetch schedules');
  }
};

// Create a new schedule
export const createSchedule = async (scheduleData: Omit<Schedule, 'id'>): Promise<Schedule> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newSchedule: Schedule = {
      id: schedules.length + 1,
      ...scheduleData,
      status: 'active'
    };
    
    schedules.push(newSchedule);
    return newSchedule;
  } catch (error) {
    console.error('Failed to create schedule:', error);
    throw new Error('Failed to create schedule');
  }
};

// Update an existing schedule
export const updateSchedule = async (id: number, scheduleData: Partial<Schedule>): Promise<Schedule> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = schedules.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error('Schedule not found');
    }
    
    const updatedSchedule = {
      ...schedules[index],
      ...scheduleData
    };
    
    schedules[index] = updatedSchedule;
    return updatedSchedule;
  } catch (error) {
    console.error('Failed to update schedule:', error);
    throw new Error('Failed to update schedule');
  }
};

// Delete a schedule
export const deleteSchedule = async (id: number): Promise<void> => {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const index = schedules.findIndex(s => s.id === id);
    if (index === -1) {
      throw new Error('Schedule not found');
    }
    
    schedules = schedules.filter(s => s.id !== id);
  } catch (error) {
    console.error('Failed to delete schedule:', error);
    throw new Error('Failed to delete schedule');
  }
}; 