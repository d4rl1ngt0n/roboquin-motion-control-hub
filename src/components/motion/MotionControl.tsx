
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Square, Upload } from 'lucide-react';
import { ServoController } from './ServoController';
import { MotionPresets } from './MotionPresets';

export function MotionControl() {
  const [selectedMannequin, setSelectedMannequin] = useState('MQ-001');
  const [isPlaying, setIsPlaying] = useState(false);

  const mannequins = [
    { id: 'MQ-001', name: 'Store A - Window Display', status: 'online' },
    { id: 'MQ-002', name: 'Store B - Main Floor', status: 'online' },
    { id: 'MQ-004', name: 'Store D - VIP Section', status: 'online' },
    { id: 'MQ-006', name: 'Store F - Fitting Area', status: 'online' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Motion Control Center</h1>
        <p className="text-gray-600">Control mannequin movements and manage motion presets</p>
      </div>

      {/* Mannequin Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Mannequin</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {mannequins.map((mannequin) => (
              <div
                key={mannequin.id}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  selectedMannequin === mannequin.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedMannequin(mannequin.id)}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{mannequin.id}</h3>
                  <Badge variant="default">Online</Badge>
                </div>
                <p className="text-sm text-gray-600">{mannequin.name}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Real-time Control */}
        <Card>
          <CardHeader>
            <CardTitle>Real-time Control - {selectedMannequin}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Button 
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="flex items-center gap-2"
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  {isPlaying ? 'Pause' : 'Play'}
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Square className="h-4 w-4" />
                  Stop
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  Upload Preset
                </Button>
              </div>
              
              <ServoController />
            </div>
          </CardContent>
        </Card>

        {/* Motion Presets */}
        <Card>
          <CardHeader>
            <CardTitle>Motion Presets</CardTitle>
          </CardHeader>
          <CardContent>
            <MotionPresets selectedMannequin={selectedMannequin} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
