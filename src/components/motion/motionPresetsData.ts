export interface MotionPreset {
  id: number;
  name: string;
  description: string;
  duration: string;
  category: string;
  // mannequinId?: string // Uncomment if you want to associate with a mannequin
}

export const motionPresets: MotionPreset[] = [
  {
    id: 1,
    name: 'Welcome Gesture',
    description: 'Friendly wave with head turn',
    duration: '3.5s',
    category: 'greeting',
  },
  {
    id: 2,
    name: 'Fashion Pose A',
    description: 'Classic runway stance',
    duration: '5.0s',
    category: 'fashion',
  },
  {
    id: 3,
    name: 'Product Showcase',
    description: 'Points to featured items',
    duration: '4.2s',
    category: 'marketing',
  },
  {
    id: 4,
    name: 'Idle Breathing',
    description: 'Subtle chest movement',
    duration: 'Loop',
    category: 'idle',
  },
  {
    id: 5,
    name: 'Attention Getter',
    description: 'Wave and point sequence',
    duration: '6.1s',
    category: 'marketing',
  },
]; 