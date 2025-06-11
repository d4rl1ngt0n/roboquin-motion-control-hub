
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ScheduleFormProps {
  onClose: () => void;
}

export function ScheduleForm({ onClose }: ScheduleFormProps) {
  const [formData, setFormData] = useState({
    device: '',
    preset: '',
    date: '',
    time: '',
    recurring: 'once',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Creating schedule:', formData);
    onClose();
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Schedule Motion</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="device">Select Device</Label>
            <Select onValueChange={(value) => setFormData(prev => ({ ...prev, device: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Choose mannequin" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MQ-001">MQ-001 - Store A Window</SelectItem>
                <SelectItem value="MQ-002">MQ-002 - Store B Main Floor</SelectItem>
                <SelectItem value="MQ-004">MQ-004 - Store D VIP</SelectItem>
                <SelectItem value="MQ-006">MQ-006 - Store F Fitting</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="preset">Motion Preset</Label>
            <Select onValueChange={(value) => setFormData(prev => ({ ...prev, preset: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Choose motion" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="welcome">Welcome Gesture</SelectItem>
                <SelectItem value="fashion-a">Fashion Pose A</SelectItem>
                <SelectItem value="showcase">Product Showcase</SelectItem>
                <SelectItem value="attention">Attention Getter</SelectItem>
                <SelectItem value="idle">Idle Breathing</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              type="date"
              value={formData.date}
              onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              type="time"
              value={formData.time}
              onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="recurring">Recurrence</Label>
            <Select onValueChange={(value) => setFormData(prev => ({ ...prev, recurring: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="once">Once</SelectItem>
                <SelectItem value="daily">Daily</SelectItem>
                <SelectItem value="weekdays">Weekdays</SelectItem>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">Create Schedule</Button>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
