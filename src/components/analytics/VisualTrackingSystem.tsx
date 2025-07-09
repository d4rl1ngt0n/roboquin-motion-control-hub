import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Camera, Upload, Download, CalendarDays, 
  Eye, Filter, BarChart3, TrendingUp, Image, 
  Clock, MapPin, Users, Heart, Star, PlusCircle, X
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LabelList, LineChart, Line } from 'recharts';
import { Tooltip as RechartsTooltip } from 'recharts';
import { motionPresets } from '../motion/motionPresetsData';

// Visual Tracking Data Types
interface VisualAppearance {
  id: string;
  mannequinId: string;
  mannequinName: string;
  storeId: string;
  storeName: string;
  date: Date;
  photoUrl: string;
  clothingCategory: string;
  movementType: string;
  clientAttention: number; // Changed from engagementScore
  avgClientAttention: number; // New field for average attention in seconds
  customerReactions: number;
  notes: string;
  tags: string[];
  timeOfDay: 'morning' | 'afternoon' | 'evening';
  lightingCondition: 'natural' | 'artificial' | 'mixed';
  clientId: string;
}

interface VisualTrend {
  date: string;
  avgClientAttention: number;
  totalPhotos: number;
  positiveReactions: number;
  clothingChanges: number;
}

interface AppearanceComparison {
  beforePhoto: string;
  afterPhoto: string;
  date: string;
  engagementChange: number;
  clothingCategory: string;
  notes: string;
}

// Mock Data
// NOTE: Make sure your images are in public/MannequinImages/ (no space)
const mockVisualAppearances: VisualAppearance[] = [
  {
    id: '1',
    mannequinId: 'MQ-001',
    mannequinName: 'Window Display',
    storeId: 'storeA',
    storeName: 'Store A',
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    photoUrl: '/MannequinImages/mannq1.jpg',
    clothingCategory: 'Casual Wear',
    movementType: 'Welcome Gesture',
    clientAttention: 85,
    avgClientAttention: 23.5, // Average attention time in seconds
    customerReactions: 23,
    notes: 'Spring casual collection with light colors. High attention during morning hours.',
    tags: ['spring', 'casual', 'light-colors', 'morning'],
    timeOfDay: 'morning',
    lightingCondition: 'natural',
    clientId: 'client-123',
  },
  {
    id: '2',
    mannequinId: 'MQ-002',
    mannequinName: 'Main Floor',
    storeId: 'storeA',
    storeName: 'Store A',
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    photoUrl: '/MannequinImages/mannq2.jpg',
    clothingCategory: 'Formal Wear',
    movementType: 'Fashion Pose A',
    clientAttention: 92,
    avgClientAttention: 31.2,
    customerReactions: 31,
    notes: 'Evening formal wear with sophisticated styling. Excellent attention with luxury shoppers.',
    tags: ['formal', 'evening', 'luxury', 'sophisticated'],
    timeOfDay: 'evening',
    lightingCondition: 'artificial',
    clientId: 'client-123',
  },
  {
    id: '3',
    mannequinId: 'MQ-003',
    mannequinName: 'Entrance',
    storeId: 'storeB',
    storeName: 'Store B',
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    photoUrl: '/MannequinImages/mannq4.jpg',
    clothingCategory: 'Accessories',
    movementType: 'Product Showcase',
    clientAttention: 68,
    avgClientAttention: 12.8,
    customerReactions: 12,
    notes: 'Accessories display with minimal styling. Moderate attention, needs improvement.',
    tags: ['accessories', 'minimal', 'moderate-attention'],
    timeOfDay: 'afternoon',
    lightingCondition: 'mixed',
    clientId: 'client-456',
  },
  {
    id: '4',
    mannequinId: 'MQ-004',
    mannequinName: 'VIP Section',
    storeId: 'storeB',
    storeName: 'Store B',
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    photoUrl: '/MannequinImages/mannq5.jpg',
    clothingCategory: 'Luxury Items',
    movementType: 'Attention Getter',
    clientAttention: 95,
    avgClientAttention: 45.7,
    customerReactions: 45,
    notes: 'Premium luxury items with exclusive styling. Exceptional attention with high-end customers.',
    tags: ['luxury', 'premium', 'exclusive', 'high-attention'],
    timeOfDay: 'afternoon',
    lightingCondition: 'natural',
    clientId: 'client-123',
  },
  {
    id: '5',
    mannequinId: 'MQ-005',
    mannequinName: 'Seasonal Display',
    storeId: 'storeD',
    storeName: 'Store D',
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    photoUrl: '/MannequinImages/mannq6.jpg',
    clothingCategory: 'Seasonal Collection',
    movementType: 'Idle Breathing',
    clientAttention: 78,
    avgClientAttention: 18.3,
    customerReactions: 18,
    notes: 'Seasonal collection with vibrant colors. Good attention with trend-conscious shoppers.',
    tags: ['seasonal', 'vibrant', 'trendy', 'good-attention'],
    timeOfDay: 'morning',
    lightingCondition: 'mixed',
    clientId: 'client-123',
  }
];

const mockVisualTrends: VisualTrend[] = [
  { date: '2024-01-01', avgClientAttention: 82, totalPhotos: 5, positiveReactions: 32, clothingChanges: 3 },
  { date: '2024-01-02', avgClientAttention: 85, totalPhotos: 5, positiveReactions: 38, clothingChanges: 4 },
  { date: '2024-01-03', avgClientAttention: 79, totalPhotos: 5, positiveReactions: 33, clothingChanges: 2 },
  { date: '2024-01-04', avgClientAttention: 88, totalPhotos: 5, positiveReactions: 45, clothingChanges: 5 },
  { date: '2024-01-05', avgClientAttention: 91, totalPhotos: 5, positiveReactions: 52, clothingChanges: 4 },
  { date: '2024-01-06', avgClientAttention: 87, totalPhotos: 5, positiveReactions: 42, clothingChanges: 3 },
  { date: '2024-01-07', avgClientAttention: 93, totalPhotos: 5, positiveReactions: 58, clothingChanges: 6 },
];

const mockAppearanceComparisons: AppearanceComparison[] = [
  {
    beforePhoto: '/api/photos/comparison-1-before.jpg',
    afterPhoto: '/api/photos/comparison-1-after.jpg',
    date: '2024-01-05',
    engagementChange: 15,
    clothingCategory: 'Casual Wear',
    notes: 'Changed from dark to light colors, increased engagement by 15%'
  },
  {
    beforePhoto: '/api/photos/comparison-2-before.jpg',
    afterPhoto: '/api/photos/comparison-2-after.jpg',
    date: '2024-01-03',
    engagementChange: 8,
    clothingCategory: 'Formal Wear',
    notes: 'Updated styling with more sophisticated accessories, 8% engagement increase'
  }
];

// Helper function to check if two dates are the same day
const isSameDay = (date1: Date, date2: Date) => {
  return date1.toDateString() === date2.toDateString();
};

// Error Boundary Component for Visual Tracking System
class VisualTrackingErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('VisualTrackingSystem Error:', error, errorInfo);
    // Force reset any stuck modals
    const modals = document.querySelectorAll('[role="dialog"]');
    modals.forEach(modal => {
      if (modal instanceof HTMLElement) {
        modal.style.display = 'none';
      }
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 flex items-center justify-center">
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
            <p className="text-gray-600 mb-6">The Visual Tracking System encountered an error.</p>
            <Button 
              onClick={() => {
                this.setState({ hasError: false });
                window.location.reload();
              }}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg"
            >
              Reload Page
            </Button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Main component wrapped with error boundary
export function VisualTrackingSystem() {
  return (
    <VisualTrackingErrorBoundary>
      <VisualTrackingSystemContent />
    </VisualTrackingErrorBoundary>
  );
}

// Actual component content
function VisualTrackingSystemContent() {
  const [selectedStore, setSelectedStore] = useState('all');
  const [selectedMannequin, setSelectedMannequin] = useState('all');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [showPhotoViewer, setShowPhotoViewer] = useState(false);
  const [selectedAppearance, setSelectedAppearance] = useState<VisualAppearance | null>(null);
  const [uploadForm, setUploadForm] = useState({
    mannequinId: '',
    clothingCategory: '',
    movementType: '',
    notes: '',
    tags: '',
    timeOfDay: 'morning' as const,
    lightingCondition: 'natural' as const,
    timeOfDayTime: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // In the component, set the current clientId (mock)
  const currentClientId = 'client-123';

  // CRITICAL: Force reset all modal states on mount to prevent stuck overlays
  useEffect(() => {
    setShowPhotoUpload(false);
    setShowPhotoViewer(false);
    setSelectedAppearance(null);
    
    // Clear any stuck overlays by forcing a re-render
    const timer = setTimeout(() => {
      // This ensures any stuck overlays are cleared
    }, 100);
    
    return () => {
      clearTimeout(timer);
      setShowPhotoUpload(false);
      setShowPhotoViewer(false);
      setSelectedAppearance(null);
    };
  }, []);

  // Additional safety: reset modals on any state change that might cause issues
  useEffect(() => {
    const handleBeforeUnload = () => {
      setShowPhotoUpload(false);
      setShowPhotoViewer(false);
      setSelectedAppearance(null);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      setShowPhotoUpload(false);
      setShowPhotoViewer(false);
      setSelectedAppearance(null);
    };
  }, []);

  // Global overlay reset function - only call when needed
  const resetAllOverlays = () => {
    try {
      // Only remove overlays if no modals are open
      if (!showPhotoUpload && !showPhotoViewer) {
        const overlays = document.querySelectorAll('[data-radix-dialog-overlay], [data-radix-popover-overlay]');
        overlays.forEach(overlay => {
          if (overlay instanceof HTMLElement) {
            overlay.remove();
          }
        });
      }
    } catch (error) {
      console.error('Error resetting overlays:', error);
    }
  };

  // Only reset overlays when modals are closed, not on every render
  useEffect(() => {
    if (!showPhotoUpload && !showPhotoViewer) {
      resetAllOverlays();
    }
  }, [showPhotoUpload, showPhotoViewer]);

  // Safe modal close functions with error handling
  const safeClosePhotoUpload = () => {
    try {
      setShowPhotoUpload(false);
      setSelectedFile(null);
      setPreviewUrl(null);
      setUploadForm({
        mannequinId: '',
        clothingCategory: '',
        movementType: '',
        notes: '',
        tags: '',
        timeOfDay: 'morning' as const,
        lightingCondition: 'natural' as const,
        timeOfDayTime: '',
      });
      // Reset overlays after closing
      setTimeout(resetAllOverlays, 100);
    } catch (error) {
      console.error('Error closing photo upload modal:', error);
      // Force reset
      setShowPhotoUpload(false);
    }
  };

  const safeClosePhotoViewer = () => {
    try {
      setShowPhotoViewer(false);
      setSelectedAppearance(null);
      // Reset overlays after closing
      setTimeout(resetAllOverlays, 100);
    } catch (error) {
      console.error('Error closing photo viewer modal:', error);
      // Force reset
      setShowPhotoViewer(false);
      setSelectedAppearance(null);
    }
  };

  // Replace const mockVisualAppearances with state
  const [appearances, setAppearances] = useState<VisualAppearance[]>([...mockVisualAppearances]);

  // Filter data based on selections
  const filteredAppearances = appearances.filter(appearance => {
    if (selectedStore !== 'all' && appearance.storeId !== selectedStore) return false;
    if (selectedMannequin !== 'all' && appearance.mannequinId !== selectedMannequin) return false;
    if (selectedDate && !isSameDay(appearance.date, selectedDate)) return false;
    return true;
  });

  // Filter appearances for the current client
  const clientAppearances = appearances.filter(a => a.clientId === currentClientId);

  const filteredTrends = mockVisualTrends;
  const filteredComparisons = mockAppearanceComparisons;

  // Calculate metrics
  const totalPhotos = clientAppearances.length;
  const avgClientAttention = clientAppearances.length > 0 
    ? Math.round(clientAppearances.reduce((sum, a) => sum + a.clientAttention, 0) / clientAppearances.length) 
    : 0;
  const totalReactions = clientAppearances.reduce((sum, a) => sum + a.customerReactions, 0);
  const uniqueClothingCategories = new Set(clientAppearances.map(a => a.clothingCategory)).size;

  // Compute average engagement by clothing category
  const categoryStats = React.useMemo(() => {
    const stats: Record<string, { total: number; count: number }> = {};
    clientAppearances.forEach(a => {
      if (!a.clothingCategory) return;
      if (!stats[a.clothingCategory]) {
        stats[a.clothingCategory] = { total: 0, count: 0 };
      }
      stats[a.clothingCategory].total += a.clientAttention;
      stats[a.clothingCategory].count += 1;
    });
    return Object.entries(stats).map(([category, { total, count }]) => ({
      category,
      avgClientAttention: +(total / count).toFixed(1),
      count
    }));
  }, [clientAppearances]);

  // Clothing Category dropdown options
  const clothingCategories = [
    'Casual Wear',
    'Formal Wear',
    'Accessories',
    'Luxury Items',
    'Seasonal Collection',
    'Other',
  ];
  const [customClothingCategory, setCustomClothingCategory] = useState('');

  const handlePhotoUpload = () => {
    setShowPhotoUpload(true);
  };

  const handlePhotoView = (appearance: VisualAppearance) => {
    try {
      setSelectedAppearance(appearance);
      // Small delay to ensure state is set before opening modal
      setTimeout(() => {
        setShowPhotoViewer(true);
      }, 10);
    } catch (error) {
      console.error('Error opening photo viewer:', error);
      // Fallback
      setSelectedAppearance(appearance);
      setShowPhotoViewer(true);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleUploadSubmit = () => {
    if (selectedFile) {
      const newAppearance: VisualAppearance = {
        id: Date.now().toString(),
        mannequinId: uploadForm.mannequinId,
        mannequinName: uploadForm.mannequinId ?
          (['MQ-001','MQ-002','MQ-003','MQ-004','MQ-005'].includes(uploadForm.mannequinId) ?
            {
              'MQ-001': 'Window Display',
              'MQ-002': 'Main Floor',
              'MQ-003': 'Entrance',
              'MQ-004': 'VIP Section',
              'MQ-005': 'Seasonal Display',
            }[uploadForm.mannequinId] : uploadForm.mannequinId
          ) : '',
        storeId: selectedStore !== 'all' ? selectedStore : 'storeA',
        storeName: selectedStore !== 'all' ?
          (selectedStore === 'storeA' ? 'Store A' : selectedStore === 'storeB' ? 'Store B' : 'Store D') : 'Store A',
        date: new Date(),
        photoUrl: previewUrl || '',
        clothingCategory: uploadForm.clothingCategory === 'Other' ? customClothingCategory : uploadForm.clothingCategory,
        movementType: uploadForm.movementType,
        clientAttention: Math.floor(Math.random() * 30) + 70, // random for demo
        avgClientAttention: Math.random() * 10 + 5, // random for demo
        customerReactions: Math.floor(Math.random() * 30), // random for demo
        notes: uploadForm.notes,
        tags: uploadForm.tags.split(',').map(t => t.trim()).filter(Boolean),
        timeOfDay: uploadForm.timeOfDay,
        lightingCondition: uploadForm.lightingCondition,
        clientId: currentClientId,
      };
      setAppearances(prev => [newAppearance, ...prev]);
      setShowPhotoUpload(false);
      setUploadForm({
        mannequinId: '',
        clothingCategory: '',
        movementType: '',
        notes: '',
        tags: '',
        timeOfDay: 'morning' as const,
        lightingCondition: 'natural' as const,
        timeOfDayTime: '',
      });
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };

  const getClientAttentionColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getTimeOfDayIcon = (time: string) => {
    switch (time) {
      case 'morning': return <CalendarDays className="w-4 h-4" />;
      case 'afternoon': return <Clock className="w-4 h-4" />;
      case 'evening': return <Star className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  // Safe image handling with fallbacks
  const getSafeImageUrl = (url: string | null | undefined) => {
    if (!url) return '/placeholder.svg';
    if (url.startsWith('/')) return url;
    return '/placeholder.svg';
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = '/placeholder.svg';
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      {/* Decorative SVG background pattern */}
      <img 
        src="/placeholder.svg" 
        alt="background pattern" 
        className="absolute top-0 right-0 w-1/2 opacity-10 pointer-events-none select-none z-0" 
        onError={handleImageError}
      />
      <div className="relative z-10 px-4 py-8 max-w-7xl mx-auto">
        {/* 2. Enhanced header with tagline and branding */}
        <div className="bg-gradient-to-r from-blue-100 to-blue-200 rounded-2xl p-8 mb-8 flex items-center gap-6 shadow-md border border-blue-100">
          <div className="flex items-center justify-center w-20 h-20 rounded-full bg-blue-300 shadow-lg">
            <Camera className="w-10 h-10 text-blue-800" />
          </div>
          <div>
            <h1 className="text-4xl font-extrabold text-blue-900 mb-1 tracking-tight">Visual Tracking System</h1>
            <p className="text-blue-700 text-lg mb-2">Upload, track, and analyze your RoboQuin's appearances. See engagement, trends, and more!</p>
            <span className="text-blue-400 font-semibold text-sm">Powered by RoboQuin</span>
          </div>
        </div>
        {/* Add always-visible Upload button above filters and gallery */}
        <div className="flex justify-end mb-4">
          <Button className="bg-blue-600 text-white px-5 py-2 rounded-lg text-base flex items-center gap-2 shadow transition-transform hover:scale-105" onClick={() => setShowPhotoUpload(true)}>
            <Upload className="w-5 h-5" /> Upload Appearance Photo
          </Button>
        </div>
        {/* 5. Filter bar above gallery */}
        <div className="flex flex-wrap items-center gap-4 mb-6">
          <Select value={selectedStore} onValueChange={setSelectedStore}>
            <SelectTrigger className="w-40"><SelectValue placeholder="All Stores" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stores</SelectItem>
              <SelectItem value="storeA">Store A</SelectItem>
              <SelectItem value="storeB">Store B</SelectItem>
              <SelectItem value="storeD">Store D</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedMannequin} onValueChange={setSelectedMannequin}>
            <SelectTrigger className="w-48"><SelectValue placeholder="All Mannequins" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Mannequins</SelectItem>
              <SelectItem value="MQ-001">Window Display</SelectItem>
              <SelectItem value="MQ-002">Main Floor</SelectItem>
              <SelectItem value="MQ-003">Entrance</SelectItem>
              <SelectItem value="MQ-004">VIP Section</SelectItem>
              <SelectItem value="MQ-005">Seasonal Display</SelectItem>
            </SelectContent>
          </Select>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2"><CalendarDays className="w-4 h-4" /> {selectedDate ? format(selectedDate, 'PPP') : 'Pick a date'}</Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-auto p-0">
              <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
            </PopoverContent>
          </Popover>
          <Button variant="ghost" onClick={() => { setSelectedStore('all'); setSelectedMannequin('all'); setSelectedDate(undefined); }}>
            <Filter className="w-4 h-4 mr-1" /> Reset Filters
          </Button>
        </div>
        {/* 3. Animated metrics cards with tooltips */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <Card className="shadow-xl rounded-xl bg-gradient-to-br from-blue-50 to-white transition-transform hover:scale-105 group">
            <CardContent className="flex flex-col items-center p-6">
              <Image className="w-7 h-7 text-blue-500 mb-2 animate-bounce" />
              <span className="text-2xl font-bold text-blue-900 count-up" title="Total appearance photos">{totalPhotos}</span>
              <span className="text-gray-500 text-sm">Total Photos</span>
            </CardContent>
          </Card>
          <Card className="shadow-xl rounded-xl bg-gradient-to-br from-green-50 to-white transition-transform hover:scale-105 group">
            <CardContent className="flex flex-col items-center p-6">
              <Star className="w-7 h-7 text-green-500 mb-2 animate-pulse" />
              <span className="text-2xl font-bold text-green-700 count-up" title="Average client attention score">{avgClientAttention}%</span>
              <span className="text-gray-500 text-sm">Avg Client Attention</span>
            </CardContent>
          </Card>
          <Card className="shadow-xl rounded-xl bg-gradient-to-br from-pink-50 to-white transition-transform hover:scale-105 group">
            <CardContent className="flex flex-col items-center p-6">
              <Heart className="w-7 h-7 text-pink-500 mb-2 animate-pulse" />
              <span className="text-2xl font-bold text-pink-700 count-up" title="Total customer reactions">{totalReactions}</span>
              <span className="text-gray-500 text-sm">Total Reactions</span>
            </CardContent>
          </Card>
          <Card className="shadow-xl rounded-xl bg-gradient-to-br from-purple-50 to-white transition-transform hover:scale-105 group">
            <CardContent className="flex flex-col items-center p-6">
              <BarChart3 className="w-7 h-7 text-purple-500 mb-2 animate-bounce" />
              <span className="text-2xl font-bold text-purple-700 count-up" title="Unique clothing categories">{uniqueClothingCategories}</span>
              <span className="text-gray-500 text-sm">Clothing Categories</span>
            </CardContent>
          </Card>
        </div>
        {/* 4. Gallery with hover overlays and quick actions */}
        <h2 className="text-2xl font-bold text-blue-900 mb-4 flex items-center gap-2"><Image className="w-6 h-6 text-blue-500" /> Visual Appearances Gallery</h2>
        {clientAppearances.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            {/* 7. Custom SVG illustration for empty state */}
            <img src="/placeholder.svg" alt="No appearances" className="w-40 h-40 mb-6 opacity-80" />
            <p className="text-lg text-gray-500 mb-2">No appearance photos yet.<br />Upload your first RoboQuin appearance to get started!</p>
            <Button className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg text-lg flex items-center gap-2 transition-transform hover:scale-105" onClick={() => setShowPhotoUpload(true)}>
              <PlusCircle className="w-5 h-5" /> Upload Appearance Photo
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {clientAppearances.map(a => (
              <Card key={a.id} className="hover:shadow-2xl transition-shadow rounded-xl cursor-pointer group relative overflow-hidden">
                <div className="relative">
                  <img 
                    src={getSafeImageUrl(a.photoUrl)} 
                    alt={a.mannequinName} 
                    className="w-full h-48 object-cover rounded-t-xl group-hover:opacity-90 transition-opacity duration-200" 
                    onError={handleImageError}
                  />
                  {/* 6. Hover overlay with quick actions */}
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 flex items-center justify-center gap-4 opacity-0 group-hover:opacity-100 transition-all duration-200">
                    <Button size="icon" variant="secondary" className="shadow-lg" onClick={() => handlePhotoView(a)} title="View Details"><Eye className="w-5 h-5" /></Button>
                    <Button size="icon" variant="secondary" className="shadow-lg" title="Download"><Download className="w-5 h-5" /></Button>
                  </div>
                  {/* 4. Animated badge */}
                  <Badge className="absolute top-2 right-2 bg-blue-600 text-white shadow animate-pulse transition-transform group-hover:scale-110">{a.clientAttention}%</Badge>
                </div>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700 font-semibold">{a.storeName}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-700">{a.mannequinName}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-500 text-sm">{format(a.date, 'PPP')}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {a.tags.map(tag => (
                      <Badge key={tag} className="bg-blue-100 text-blue-700 animate-fade-in">#{tag}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        {/* After the gallery section, add the chart */}
        {categoryStats.length > 0 && (
          <Card className="mt-10">
            <CardHeader>
              <CardTitle className="text-lg font-bold">Client Attention by Clothing Category</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={categoryStats} margin={{ top: 16, right: 32, left: 0, bottom: 16 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis domain={[0, 100]} tickFormatter={v => v + '%'} />
                  <Tooltip formatter={(value) => value + '%'} />
                  <Bar dataKey="avgClientAttention" fill="#2563eb">
                    <LabelList dataKey="avgClientAttention" position="top" formatter={v => v + '%'} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}
        {/* After the bar chart, add a grid/table for client attention by specific appearance, using filteredAppearances */}
        {filteredAppearances.length > 0 && (
          <div className="my-12">
            <h3 className="text-xl font-bold mb-4">Client Attention by Specific Appearance</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredAppearances.map(a => (
                <div
                  key={a.id}
                  className="bg-white rounded-lg shadow p-4 flex flex-col items-center cursor-pointer hover:shadow-xl hover:ring-2 hover:ring-blue-400 transition"
                  onClick={() => handlePhotoView(a)}
                >
                  <img 
                    src={getSafeImageUrl(a.photoUrl)} 
                    alt={a.clothingCategory} 
                    className="w-32 h-32 object-cover rounded mb-2 border" 
                    onError={handleImageError}
                  />
                  <div className="font-semibold mb-1">{a.clothingCategory}</div>
                  <div className="text-gray-500 text-xs mb-1">{a.tags && a.tags.length > 0 ? a.tags.join(', ') : <span className="italic">No tags</span>}</div>
                  <div className="mt-2 text-blue-700 font-bold">{a.clientAttention}% attention</div>
                  <div className="text-gray-600 text-xs">{a.customerReactions} reactions</div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Appearance Comparisons */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Before & After Comparisons
            </CardTitle>
            <p className="text-sm text-gray-500">Visual changes and their impact on engagement</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredComparisons.map((comparison, index) => (
                <div key={index} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                          <Image className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-xs text-gray-600">Before</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">→</div>
                        <p className="text-xs text-gray-600">Change</p>
                      </div>
                      <div className="text-center">
                        <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center mb-2">
                          <Image className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-xs text-gray-600">After</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className={`text-lg font-bold ${comparison.engagementChange > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {comparison.engagementChange > 0 ? '+' : ''}{comparison.engagementChange}%
                    </div>
                    <div className="text-sm text-gray-600">{comparison.clothingCategory}</div>
                    <div className="text-xs text-gray-500">{comparison.date}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        {/* Photo Upload Modal with enhanced error handling */}
        <Dialog 
          open={showPhotoUpload} 
          onOpenChange={(open) => {
            if (!open) {
              safeClosePhotoUpload();
            }
          }}
        >
          <DialogContent
            className="sm:max-w-[600px] bg-white rounded-lg shadow-lg"
            style={{ 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -50%)', 
              position: 'fixed',
              zIndex: 1000
            }}
          >
            <DialogHeader>
              <DialogTitle>Upload Visual Appearance</DialogTitle>
              <DialogDescription>
                Upload a photo of the RoboQuin appearance for visual tracking
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Mannequin</Label>
                  <Select value={uploadForm.mannequinId} onValueChange={(value) => setUploadForm({...uploadForm, mannequinId: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Mannequin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MQ-001">MQ-001 (Window Display)</SelectItem>
                      <SelectItem value="MQ-002">MQ-002 (Main Floor)</SelectItem>
                      <SelectItem value="MQ-003">MQ-003 (Entrance)</SelectItem>
                      <SelectItem value="MQ-004">MQ-004 (VIP Section)</SelectItem>
                      <SelectItem value="MQ-005">MQ-005 (Seasonal Display)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Clothing Category</Label>
                  <Select
                    value={uploadForm.clothingCategory}
                    onValueChange={(value) => setUploadForm({ ...uploadForm, clothingCategory: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="e.g., Casual Wear" />
                    </SelectTrigger>
                    <SelectContent>
                      {clothingCategories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {uploadForm.clothingCategory === 'Other' && (
                    <Input
                      className="mt-2"
                      placeholder="Enter custom category"
                      value={customClothingCategory}
                      onChange={e => {
                        setCustomClothingCategory(e.target.value);
                        setUploadForm({ ...uploadForm, clothingCategory: e.target.value });
                      }}
                    />
                  )}
                </div>
                <div>
                  <Label>Movement Type</Label>
                  <Select
                    value={uploadForm.movementType}
                    onValueChange={(value) => setUploadForm({ ...uploadForm, movementType: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Movement" />
                    </SelectTrigger>
                    <SelectContent>
                      {motionPresets.map((preset) => (
                        <SelectItem key={preset.id} value={preset.name}>{preset.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Time of Day</Label>
                  <Input
                    type="time"
                    value={uploadForm.timeOfDayTime || ''}
                    onChange={e => {
                      const time = e.target.value;
                      let tod = 'morning';
                      const hour = parseInt(time.split(':')[0], 10);
                      if (hour >= 5 && hour < 12) tod = 'morning';
                      else if (hour >= 12 && hour < 18) tod = 'afternoon';
                      else tod = 'evening';
                      setUploadForm({ ...uploadForm, timeOfDay: tod, timeOfDayTime: time });
                    }}
                  />
                  <div className="text-xs text-gray-500 mt-1">Automatically sets: <span className="font-semibold">{uploadForm.timeOfDay}</span></div>
                </div>
               
              </div>
              
              <div>
                <Label>Photo Upload</Label>
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 transition"
                  onClick={() => fileInputRef.current?.click()}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                >
                  {previewUrl ? (
                    <img src={previewUrl} alt="Preview" className="mx-auto mb-2 rounded-lg max-h-40 object-contain" />
                  ) : (
                    <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  )}
                  <p className="text-sm text-gray-600">Click or drag and drop to upload photo</p>
                  <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                  <input
                    type="file"
                    accept="image/png, image/jpeg"
                    className="hidden"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                  />
                </div>
              </div>
              
              <div>
                <Label>Tags</Label>
                <Input 
                  value={uploadForm.tags}
                  onChange={(e) => setUploadForm({...uploadForm, tags: e.target.value})}
                  placeholder="e.g., spring, casual, morning (comma separated)"
                />
              </div>
              
              <div>
                <Label>Notes</Label>
                <Textarea 
                  value={uploadForm.notes}
                  onChange={(e) => setUploadForm({...uploadForm, notes: e.target.value})}
                  placeholder="Add notes about the appearance and engagement..."
                  rows={3}
                />
              </div>
              
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowPhotoUpload(false)}>
                  Cancel
                </Button>
                <Button onClick={handleUploadSubmit}>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Photo
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        {/* Photo Viewer Modal with enhanced error handling */}
        <Dialog 
          open={showPhotoViewer && selectedAppearance !== null} 
          onOpenChange={(open) => {
            if (!open) {
              safeClosePhotoViewer();
            }
          }}
        >
          <DialogContent
            key={selectedAppearance?.id || 'no-selection'}
            className="sm:max-w-[800px] bg-white rounded-lg shadow-lg"
            style={{ 
              top: '50%', 
              left: '50%', 
              transform: 'translate(-50%, -50%)', 
              position: 'fixed',
              zIndex: 1000
            }}
          >
            <DialogHeader>
              <DialogTitle>Visual Appearance Details</DialogTitle>
              <DialogDescription>
                Detailed view of RoboQuin appearance and engagement data
              </DialogDescription>
            </DialogHeader>
            {/* Scrollable content wrapper */}
            <div className="overflow-y-auto max-h-[70vh]">
              {selectedAppearance ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Analytics Panel */}
                    <div className="bg-blue-50 rounded-lg p-4 flex flex-col items-center justify-center">
                      <div className="mb-4 w-full">
                        <div className="h-[180px]">
                          <ResponsiveContainer width="100%" height={180}>
                            <LineChart data={[
                              { time: '9am', engagement: 40 },
                              { time: '10am', engagement: 55 },
                              { time: '11am', engagement: 80 },
                              { time: '12pm', engagement: 60 },
                              { time: '1pm', engagement: 90 }, // peak
                              { time: '2pm', engagement: 70 },
                              { time: '3pm', engagement: 50 },
                            ]}>
                              <XAxis dataKey="time" />
                              <YAxis domain={[0, 100]} tickFormatter={v => v + '%'} />
                              <RechartsTooltip formatter={v => v + '%'} />
                              <Line type="monotone" dataKey="engagement" stroke="#2563eb" strokeWidth={2} dot={{ r: 4 }} />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                        {/* Fallback if chart fails */}
                        <div className="text-center text-gray-500 text-sm mt-2">
                          Engagement over time
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 w-full">
                        <div className="flex justify-between"><span className="font-semibold">Peak Engagement</span><span className="text-blue-700 font-bold">90% (1pm)</span></div>
                        <div className="flex justify-between"><span className="font-semibold">Total Visits</span><span>124</span></div>
                        <div className="flex justify-between"><span className="font-semibold">Total Interactions</span><span>37</span></div>
                        <div className="flex justify-between"><span className="font-semibold">Client Attention</span><span>4.7/5 ⭐</span></div>
                      </div>
                      <div className="mt-4 w-full">
                        <div className="font-semibold mb-1">Top Tags</div>
                        <div className="flex flex-wrap gap-1">
                          {(selectedAppearance.tags || []).slice(0, 3).map((tag, i) => (
                            <Badge key={i} className="bg-blue-100 text-blue-700">#{tag}</Badge>
                          ))}
                        </div>
                      </div>
                      <div className="mt-4 w-full">
                        <div className="font-semibold mb-1">Comparative Stats</div>
                        <div className="text-sm text-gray-600">This appearance performed better than 78% of other looks.</div>
                      </div>
                    </div>
                    {/* Details Panel */}
                    <div className="space-y-4">
                      <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center mb-4 overflow-hidden">
                        <img src={getSafeImageUrl(selectedAppearance.photoUrl)} alt="Appearance" className="object-contain w-full h-full" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>Mannequin</Label>
                          <Input value={selectedAppearance.mannequinName} readOnly />
                        </div>
                        <div>
                          <Label>Store</Label>
                          <Input value={selectedAppearance.storeName} readOnly />
                        </div>
                        <div>
                          <Label>Date</Label>
                          <Input value={format(selectedAppearance.date, 'PPP')} readOnly />
                        </div>
                        <div>
                          <Label>Time of Day</Label>
                          <Input value={selectedAppearance.timeOfDay} readOnly />
                        </div>
                        <div>
                          <Label>Clothing Category</Label>
                          <Input value={selectedAppearance.clothingCategory} readOnly />
                        </div>
                        <div>
                          <Label>Movement Type</Label>
                          <Input value={selectedAppearance.movementType} readOnly />
                        </div>
                        <div>
                          <Label>Engagement Score</Label>
                          <Input value={`${selectedAppearance.clientAttention}%`} readOnly />
                        </div>
                        <div>
                          <Label>Customer Reactions</Label>
                          <Input value={selectedAppearance.customerReactions.toString()} readOnly />
                        </div>
                      </div>
                      <div>
                        <Label>Notes</Label>
                        <Textarea value={selectedAppearance.notes} readOnly rows={3} />
                      </div>
                      <div>
                        <Label>Tags</Label>
                        <div className="flex flex-wrap gap-1">
                          {(selectedAppearance.tags || []).map((tag, index) => (
                            <Badge key={index} variant="outline">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setShowPhotoViewer(false)}>
                      Close
                    </Button>
                    <Button>
                      <Download className="w-4 h-4 mr-2" />
                      Download Photo
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <Image className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-600">No appearance selected</p>
                    <p className="text-sm text-gray-500">Please select an appearance to view details</p>
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
} 