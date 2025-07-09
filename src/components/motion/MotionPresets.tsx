import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { motionPresets } from './motionPresetsData';

interface MotionPresetsProps {
  selectedMannequin: string;
}

interface Preset {
  id: number;
  name: string;
  description: string;
  duration: string;
  category: string;
}

export function MotionPresets({ selectedMannequin }: MotionPresetsProps) {
  const [presets, setPresets] = useState<Preset[]>([...motionPresets]);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingPreset, setEditingPreset] = useState<Preset | null>(null);
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    duration: '',
    category: ''
  });

  const handlePlayPreset = (preset: Preset) => {
    if (!selectedMannequin) {
      toast.error('Please select a mannequin first');
      return;
    }
    toast.success(`Playing "${preset.name}" on ${selectedMannequin}`);
  };

  const handleEditPreset = (preset: Preset) => {
    setEditingPreset(preset);
    setEditForm({
      name: preset.name,
      description: preset.description,
      duration: preset.duration,
      category: preset.category
    });
    setShowEditModal(true);
  };

  const handleDeletePreset = (presetId: number) => {
    setPresets(prev => prev.filter(p => p.id !== presetId));
    toast.success('Preset deleted successfully');
  };

  const handleSaveEdit = () => {
    if (!editingPreset) return;

    setPresets(prev => prev.map(p => 
      p.id === editingPreset.id 
        ? { ...p, ...editForm }
        : p
    ));
    toast.success('Preset updated successfully');
    setShowEditModal(false);
    setEditingPreset(null);
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'greeting': return 'bg-green-100 text-green-800';
      case 'fashion': return 'bg-purple-100 text-purple-800';
      case 'marketing': return 'bg-blue-100 text-blue-800';
      case 'idle': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-4">
      {presets.map((preset) => (
        <div key={preset.id} className="p-4 border rounded-lg">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className="font-semibold">{preset.name}</h4>
              <p className="text-sm text-gray-600">{preset.description}</p>
            </div>
            <Badge className={getCategoryColor(preset.category)}>
              {preset.category}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Duration: {preset.duration}</span>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handlePlayPreset(preset)}
              >
                <Play className="h-3 w-3" />
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleEditPreset(preset)}
              >
                <Edit className="h-3 w-3" />
              </Button>
              <Button 
                size="sm" 
                variant="outline"
                onClick={() => handleDeletePreset(preset.id)}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      ))}

      {/* Edit Preset Modal */}
      <Dialog open={showEditModal} onOpenChange={setShowEditModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Motion Preset</DialogTitle>
            <DialogDescription>
              Update the motion preset settings.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="preset-name">Preset Name</Label>
              <Input
                id="preset-name"
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="preset-description">Description</Label>
              <Textarea
                id="preset-description"
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="preset-duration">Duration</Label>
              <Input
                id="preset-duration"
                value={editForm.duration}
                onChange={(e) => setEditForm({ ...editForm, duration: e.target.value })}
                placeholder="e.g., 3.5s, Loop"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="preset-category">Category</Label>
              <Select 
                value={editForm.category} 
                onValueChange={(value) => setEditForm({ ...editForm, category: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="greeting">Greeting</SelectItem>
                  <SelectItem value="fashion">Fashion</SelectItem>
                  <SelectItem value="marketing">Marketing</SelectItem>
                  <SelectItem value="idle">Idle</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowEditModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
