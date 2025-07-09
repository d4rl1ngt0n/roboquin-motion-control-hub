import { useState } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { createSchedule, updateSchedule } from '../../api/schedules';
import { toast } from 'sonner';

interface ScheduleFormProps {
  mannequins: Array<{ id: string; name: string }>;
  presets: Array<{ id: string; name: string }>;
  onSuccess?: () => void;
  initialData?: {
    id: number;
    device: string;
    preset: string;
    time: string;
    date: string;
    recurring: string;
  };
}

export function ScheduleForm({ mannequins, presets, onSuccess, initialData }: ScheduleFormProps) {
  const [formData, setFormData] = useState({
    device: initialData?.device || '',
    preset: initialData?.preset || '',
    time: initialData?.time || '',
    date: initialData?.date || '',
    recurring: initialData?.recurring || 'Once'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (initialData) {
        await updateSchedule(initialData.id, formData);
        toast.success('Schedule updated successfully');
      } else {
        await createSchedule(formData);
        toast.success('Schedule created successfully');
      }
      onSuccess?.();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to save schedule');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="device">Device</Label>
        <Select
          value={formData.device}
          onValueChange={(value) => setFormData({ ...formData, device: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a device" />
          </SelectTrigger>
          <SelectContent>
            {mannequins.map((mannequin) => (
              <SelectItem key={mannequin.id} value={mannequin.id}>
                {mannequin.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="preset">Motion Preset</Label>
        <Select
          value={formData.preset}
          onValueChange={(value) => setFormData({ ...formData, preset: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select a preset" />
          </SelectTrigger>
          <SelectContent>
            {presets.map((preset) => (
              <SelectItem key={preset.id} value={preset.id}>
                {preset.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="time">Time</Label>
        <Input
          id="time"
          type="time"
          value={formData.time}
          onChange={(e) => setFormData({ ...formData, time: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="recurring">Recurring</Label>
        <Select
          value={formData.recurring}
          onValueChange={(value) => setFormData({ ...formData, recurring: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select frequency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Once">Once</SelectItem>
            <SelectItem value="Daily">Daily</SelectItem>
            <SelectItem value="Weekdays">Weekdays</SelectItem>
            <SelectItem value="Weekly">Weekly</SelectItem>
            <SelectItem value="Monthly">Monthly</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Saving...' : initialData ? 'Update Schedule' : 'Create Schedule'}
      </Button>
    </form>
  );
}

