
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Edit, Trash2 } from 'lucide-react';

interface MotionPresetsProps {
  selectedMannequin: string;
}

export function MotionPresets({ selectedMannequin }: MotionPresetsProps) {
  const presets = [
    {
      id: 1,
      name: 'Welcome Gesture',
      description: 'Friendly wave with head turn',
      duration: '3.5s',
      category: 'greeting'
    },
    {
      id: 2,
      name: 'Fashion Pose A',
      description: 'Classic runway stance',
      duration: '5.0s',
      category: 'fashion'
    },
    {
      id: 3,
      name: 'Product Showcase',
      description: 'Points to featured items',
      duration: '4.2s',
      category: 'marketing'
    },
    {
      id: 4,
      name: 'Idle Breathing',
      description: 'Subtle chest movement',
      duration: 'Loop',
      category: 'idle'
    },
    {
      id: 5,
      name: 'Attention Getter',
      description: 'Wave and point sequence',
      duration: '6.1s',
      category: 'marketing'
    },
  ];

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
              <Button size="sm" variant="outline">
                <Play className="h-3 w-3" />
              </Button>
              <Button size="sm" variant="outline">
                <Edit className="h-3 w-3" />
              </Button>
              <Button size="sm" variant="outline">
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
