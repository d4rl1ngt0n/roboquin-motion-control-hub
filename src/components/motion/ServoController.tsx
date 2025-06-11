
import React, { useState } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';

export function ServoController() {
  const [servoPositions, setServoPositions] = useState({
    leftArm: [90],
    rightArm: [90],
    leftLeg: [90],
    rightLeg: [90],
    head: [90],
    waist: [90],
  });

  const handleServoChange = (servo: string, value: number[]) => {
    setServoPositions(prev => ({
      ...prev,
      [servo]: value
    }));
  };

  const resetPosition = () => {
    setServoPositions({
      leftArm: [90],
      rightArm: [90],
      leftLeg: [90],
      rightLeg: [90],
      head: [90],
      waist: [90],
    });
  };

  const servoLabels = {
    leftArm: 'Left Arm',
    rightArm: 'Right Arm',
    leftLeg: 'Left Leg',
    rightLeg: 'Right Leg',
    head: 'Head',
    waist: 'Waist',
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Servo Positions</h3>
        <Button variant="outline" size="sm" onClick={resetPosition}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>
      </div>

      <div className="space-y-4">
        {Object.entries(servoPositions).map(([servo, position]) => (
          <div key={servo} className="space-y-2">
            <div className="flex justify-between">
              <label className="text-sm font-medium">
                {servoLabels[servo as keyof typeof servoLabels]}
              </label>
              <span className="text-sm text-gray-500">{position[0]}°</span>
            </div>
            <Slider
              value={position}
              onValueChange={(value) => handleServoChange(servo, value)}
              max={180}
              min={0}
              step={1}
              className="w-full"
            />
          </div>
        ))}
      </div>

      <div className="pt-4 border-t">
        <Button className="w-full">Apply Position</Button>
      </div>
    </div>
  );
}
