import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, Square, Upload, DollarSign, AlertCircle } from 'lucide-react';
import { ServoController } from './ServoController';
import { MotionPresets } from './MotionPresets';
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
import { toast } from 'sonner';

export interface Mannequin {
  id: string;
  name: string;
  status: string;
  clientId?: string;
}

interface MotionControlProps {
  mannequins?: Mannequin[];
}

export function MotionControl({ mannequins: mannequinsProp }: MotionControlProps) {
  const defaultMannequins = [
    { id: 'MQ-001', name: 'Store A - Window Display', status: 'online' },
    { id: 'MQ-002', name: 'Store B - Main Floor', status: 'online' },
    { id: 'MQ-004', name: 'Store D - VIP Section', status: 'online' },
    { id: 'MQ-006', name: 'Store F - Fitting Area', status: 'online' },
  ];
  const mannequins = mannequinsProp && mannequinsProp.length > 0 ? mannequinsProp : defaultMannequins;
  const [selectedMannequin, setSelectedMannequin] = useState(mannequins[0]?.id || '');
  const [isPlaying, setIsPlaying] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showPaidFeatureModal, setShowPaidFeatureModal] = useState(false);
  const [presetName, setPresetName] = useState('');
  const [presetDescription, setPresetDescription] = useState('');
  const [presetFile, setPresetFile] = useState<File | null>(null);

  const handlePlayPause = () => {
    if (selectedMannequin) {
      setIsPlaying(!isPlaying);
      toast.success(`${isPlaying ? 'Paused' : 'Started'} motion for ${selectedMannequin}`);
    } else {
      toast.error('Please select a mannequin first');
    }
  };

  const handleStop = () => {
    if (selectedMannequin) {
      setIsPlaying(false);
      toast.success(`Stopped motion for ${selectedMannequin}`);
    } else {
      toast.error('Please select a mannequin first');
    }
  };

  const handleUploadPreset = () => {
    setShowPaidFeatureModal(true);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setPresetFile(file);
    }
  };

  const handlePresetSubmit = async () => {
    if (!presetName.trim()) {
      toast.error('Please enter a preset name');
      return;
    }

    if (!presetFile) {
      toast.error('Please select a file');
      return;
    }

    try {
      // Simulate file upload
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(`Preset "${presetName}" uploaded successfully for ${selectedMannequin}`);
      setShowUploadModal(false);
      setPresetName('');
      setPresetDescription('');
      setPresetFile(null);
    } catch (error) {
      toast.error('Failed to upload preset');
    }
  };

  const selectedMannequinData = mannequins.find(m => m.id === selectedMannequin);

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
                  <Badge 
                    variant={mannequin.status === 'online' ? 'default' : 'secondary'}
                    className={mannequin.status === 'online' ? 'bg-green-500' : 'bg-gray-500'}
                  >
                    {mannequin.status}
                  </Badge>
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
            <div className="flex items-center justify-between">
              <CardTitle>Real-time Control - {selectedMannequinData?.name || 'No Selection'}</CardTitle>
              <Badge variant="secondary" className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0">
                <DollarSign className="h-3 w-3 mr-1" />
                Paid Feature
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Button 
                  onClick={handlePlayPause}
                  className="flex items-center gap-2"
                  disabled={!selectedMannequin || selectedMannequinData?.status !== 'online'}
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  {isPlaying ? 'Pause' : 'Play'}
                </Button>
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={handleStop}
                  disabled={!selectedMannequin || selectedMannequinData?.status !== 'online'}
                >
                  <Square className="h-4 w-4" />
                  Stop
                </Button>
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={handleUploadPreset}
                  disabled={!selectedMannequin}
                >
                  <Upload className="h-4 w-4" />
                  Upload Preset
                </Button>
              </div>
              
              {selectedMannequinData?.status !== 'online' && (
                <div className="flex items-center gap-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm text-yellow-800">
                    {selectedMannequinData?.status === 'offline' ? 'Mannequin is offline' : 'Mannequin is in maintenance'}
                  </span>
                </div>
              )}
              
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

      {/* Upload Preset Modal */}
      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Upload Motion Preset</DialogTitle>
            <DialogDescription>
              Upload a new motion preset for {selectedMannequinData?.name}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="preset-name">Preset Name</Label>
              <Input
                id="preset-name"
                value={presetName}
                onChange={(e) => setPresetName(e.target.value)}
                placeholder="Enter preset name"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="preset-description">Description</Label>
              <Textarea
                id="preset-description"
                value={presetDescription}
                onChange={(e) => setPresetDescription(e.target.value)}
                placeholder="Describe the motion preset"
                rows={3}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="preset-file">Preset File</Label>
              <Input
                id="preset-file"
                type="file"
                accept=".json,.txt"
                onChange={handleFileUpload}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowUploadModal(false)}>
              Cancel
            </Button>
            <Button onClick={handlePresetSubmit}>
              Upload Preset
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Paid Feature Modal */}
      <Dialog open={showPaidFeatureModal} onOpenChange={setShowPaidFeatureModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              Premium Feature
            </DialogTitle>
            <DialogDescription>
              This feature is available for premium users only.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-gray-600 mb-4">
              Upgrade to premium to access advanced motion control features including:
            </p>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Custom motion preset uploads
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Real-time motion control
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Advanced scheduling options
              </li>
              <li className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Priority support
              </li>
            </ul>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setShowPaidFeatureModal(false)}>
              Maybe Later
            </Button>
            <Button className="bg-gradient-to-r from-green-500 to-emerald-600">
              Upgrade Now
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
