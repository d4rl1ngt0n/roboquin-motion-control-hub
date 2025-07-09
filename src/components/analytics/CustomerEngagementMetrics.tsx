import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, Legend, AreaChart, Area 
} from 'recharts';
import { 
  Users, TrendingUp, Eye, Heart, Clock, Calendar, 
  Camera, Upload, Download, Filter, BarChart3, Activity,
  MessageSquare, ThumbsUp, ThumbsDown, Star, Target
} from 'lucide-react';

// Customer Engagement Data Types
interface CustomerInteraction {
  id: string;
  mannequinId: string;
  mannequinName: string;
  storeId: string;
  storeName: string;
  interactionDuration: number; // minutes
  engagementScore: number; // 0-100
  clothingCategory: string;
  movementType: string;
  customerReaction: 'positive' | 'neutral' | 'negative';
  timestamp: Date;
  photoUrl?: string;
  notes?: string;
}

interface EngagementTrend {
  date: string;
  avgEngagementScore: number;
  totalInteractions: number;
  positiveReactions: number;
  neutralReactions: number;
  negativeReactions: number;
}

interface ClothingPreference {
  category: string;
  interactionCount: number;
  avgEngagementScore: number;
  positiveReactionRate: number;
}

interface MovementEffectiveness {
  movementType: string;
  usageCount: number;
  avgEngagementScore: number;
  customerRetentionRate: number;
}

// Mock Data
const mockCustomerInteractions: CustomerInteraction[] = [
  {
    id: '1',
    mannequinId: 'MQ-001',
    mannequinName: 'Window Display',
    storeId: 'storeA',
    storeName: 'Store A',
    interactionDuration: 8.5,
    engagementScore: 85,
    clothingCategory: 'Casual Wear',
    movementType: 'Welcome Gesture',
    customerReaction: 'positive',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    photoUrl: '/api/photos/interaction-1.jpg',
    notes: 'Customer spent significant time examining the casual wear display'
  },
  {
    id: '2',
    mannequinId: 'MQ-002',
    mannequinName: 'Main Floor',
    storeId: 'storeA',
    storeName: 'Store A',
    interactionDuration: 12.3,
    engagementScore: 92,
    clothingCategory: 'Formal Wear',
    movementType: 'Fashion Pose A',
    customerReaction: 'positive',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    photoUrl: '/api/photos/interaction-2.jpg',
    notes: 'High engagement with formal wear showcase'
  },
  {
    id: '3',
    mannequinId: 'MQ-003',
    mannequinName: 'Entrance',
    storeId: 'storeB',
    storeName: 'Store B',
    interactionDuration: 5.2,
    engagementScore: 68,
    clothingCategory: 'Accessories',
    movementType: 'Product Showcase',
    customerReaction: 'neutral',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    notes: 'Quick interaction with accessories display'
  },
  {
    id: '4',
    mannequinId: 'MQ-004',
    mannequinName: 'VIP Section',
    storeId: 'storeB',
    storeName: 'Store B',
    interactionDuration: 15.7,
    engagementScore: 95,
    clothingCategory: 'Luxury Items',
    movementType: 'Attention Getter',
    customerReaction: 'positive',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
    photoUrl: '/api/photos/interaction-4.jpg',
    notes: 'Extended interaction with luxury items, customer appeared very interested'
  },
  {
    id: '5',
    mannequinId: 'MQ-005',
    mannequinName: 'Seasonal Display',
    storeId: 'storeD',
    storeName: 'Store D',
    interactionDuration: 9.8,
    engagementScore: 78,
    clothingCategory: 'Seasonal Collection',
    movementType: 'Idle Breathing',
    customerReaction: 'positive',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
    notes: 'Good engagement with seasonal items'
  }
];

const mockEngagementTrends: EngagementTrend[] = [
  { date: '2024-01-01', avgEngagementScore: 82, totalInteractions: 45, positiveReactions: 32, neutralReactions: 10, negativeReactions: 3 },
  { date: '2024-01-02', avgEngagementScore: 85, totalInteractions: 52, positiveReactions: 38, neutralReactions: 11, negativeReactions: 3 },
  { date: '2024-01-03', avgEngagementScore: 79, totalInteractions: 48, positiveReactions: 33, neutralReactions: 12, negativeReactions: 3 },
  { date: '2024-01-04', avgEngagementScore: 88, totalInteractions: 61, positiveReactions: 45, neutralReactions: 13, negativeReactions: 3 },
  { date: '2024-01-05', avgEngagementScore: 91, totalInteractions: 67, positiveReactions: 52, neutralReactions: 12, negativeReactions: 3 },
  { date: '2024-01-06', avgEngagementScore: 87, totalInteractions: 58, positiveReactions: 42, neutralReactions: 13, negativeReactions: 3 },
  { date: '2024-01-07', avgEngagementScore: 93, totalInteractions: 72, positiveReactions: 58, neutralReactions: 11, negativeReactions: 3 },
];

const mockClothingPreferences: ClothingPreference[] = [
  { category: 'Casual Wear', interactionCount: 156, avgEngagementScore: 82, positiveReactionRate: 78 },
  { category: 'Formal Wear', interactionCount: 134, avgEngagementScore: 89, positiveReactionRate: 85 },
  { category: 'Accessories', interactionCount: 98, avgEngagementScore: 71, positiveReactionRate: 65 },
  { category: 'Luxury Items', interactionCount: 67, avgEngagementScore: 94, positiveReactionRate: 92 },
  { category: 'Seasonal Collection', interactionCount: 123, avgEngagementScore: 86, positiveReactionRate: 81 },
];

const mockMovementEffectiveness: MovementEffectiveness[] = [
  { movementType: 'Welcome Gesture', usageCount: 234, avgEngagementScore: 85, customerRetentionRate: 78 },
  { movementType: 'Fashion Pose A', usageCount: 189, avgEngagementScore: 89, customerRetentionRate: 82 },
  { movementType: 'Product Showcase', usageCount: 167, avgEngagementScore: 76, customerRetentionRate: 71 },
  { movementType: 'Attention Getter', usageCount: 143, avgEngagementScore: 92, customerRetentionRate: 88 },
  { movementType: 'Idle Breathing', usageCount: 892, avgEngagementScore: 73, customerRetentionRate: 69 },
];

const COLORS = ['#2563eb', '#dc2626', '#16a34a', '#ca8a04', '#9333ea', '#0891b2'];

export function CustomerEngagementMetrics() {
  const [selectedStore, setSelectedStore] = useState('all');
  const [selectedMannequin, setSelectedMannequin] = useState('all');
  const [showPhotoUpload, setShowPhotoUpload] = useState(false);
  const [selectedInteraction, setSelectedInteraction] = useState<CustomerInteraction | null>(null);

  // Filter data based on selections
  const filteredInteractions = mockCustomerInteractions.filter(interaction => {
    if (selectedStore !== 'all' && interaction.storeId !== selectedStore) return false;
    if (selectedMannequin !== 'all' && interaction.mannequinId !== selectedMannequin) return false;
    return true;
  });

  const filteredTrends = mockEngagementTrends;
  const filteredClothingPreferences = mockClothingPreferences;
  const filteredMovementEffectiveness = mockMovementEffectiveness;

  // Calculate overall metrics
  const totalInteractions = filteredInteractions.length;
  const avgEngagementScore = filteredInteractions.length > 0 
    ? Math.round(filteredInteractions.reduce((sum, i) => sum + i.engagementScore, 0) / filteredInteractions.length)
    : 0;
  const positiveReactions = filteredInteractions.filter(i => i.customerReaction === 'positive').length;
  const positiveReactionRate = totalInteractions > 0 ? Math.round((positiveReactions / totalInteractions) * 100) : 0;

  const handlePhotoUpload = (interaction: CustomerInteraction) => {
    setSelectedInteraction(interaction);
    setShowPhotoUpload(true);
  };

  const getReactionIcon = (reaction: string) => {
    switch (reaction) {
      case 'positive': return <ThumbsUp className="w-4 h-4 text-green-600" />;
      case 'negative': return <ThumbsDown className="w-4 h-4 text-red-600" />;
      default: return <MessageSquare className="w-4 h-4 text-gray-600" />;
    }
  };

  const getEngagementColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Customer Engagement Metrics</h2>
          <p className="text-gray-600">Track customer interactions and engagement patterns</p>
        </div>
        <div className="flex items-center gap-4">
          <Select value={selectedStore} onValueChange={setSelectedStore}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select Store" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Stores</SelectItem>
              <SelectItem value="storeA">Store A</SelectItem>
              <SelectItem value="storeB">Store B</SelectItem>
              <SelectItem value="storeD">Store D</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedMannequin} onValueChange={setSelectedMannequin}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select Mannequin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Mannequins</SelectItem>
              <SelectItem value="MQ-001">MQ-001 (Window Display)</SelectItem>
              <SelectItem value="MQ-002">MQ-002 (Main Floor)</SelectItem>
              <SelectItem value="MQ-003">MQ-003 (Entrance)</SelectItem>
              <SelectItem value="MQ-004">MQ-004 (VIP Section)</SelectItem>
              <SelectItem value="MQ-005">MQ-005 (Seasonal Display)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Interactions</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalInteractions}</div>
            <p className="text-xs text-muted-foreground">
              Customer interactions today
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Engagement Score</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getEngagementColor(avgEngagementScore)}`}>
              {avgEngagementScore}%
            </div>
            <Progress value={avgEngagementScore} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Positive Reactions</CardTitle>
            <ThumbsUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{positiveReactionRate}%</div>
            <p className="text-xs text-muted-foreground">
              {positiveReactions} out of {totalInteractions} interactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Interaction Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {filteredInteractions.length > 0 
                ? Math.round(filteredInteractions.reduce((sum, i) => sum + i.interactionDuration, 0) / filteredInteractions.length * 10) / 10
                : 0} min
            </div>
            <p className="text-xs text-muted-foreground">
              Average duration per interaction
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Engagement Trends Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Engagement Score Trends</CardTitle>
          <p className="text-sm text-gray-500">Daily engagement score trends over time</p>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="avgEngagementScore" 
                  stroke="#2563eb" 
                  strokeWidth={3}
                  name="Average Engagement Score"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Clothing Preferences and Movement Effectiveness */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Clothing Category Engagement</CardTitle>
            <p className="text-sm text-gray-500">Engagement by clothing category</p>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={filteredClothingPreferences}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="category" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="avgEngagementScore" fill="#16a34a" name="Avg Engagement Score" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Movement Effectiveness</CardTitle>
            <p className="text-sm text-gray-500">Engagement scores by movement type</p>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={filteredMovementEffectiveness}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="movementType" />
                  <YAxis domain={[0, 100]} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="avgEngagementScore" fill="#9333ea" name="Avg Engagement Score" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Customer Interactions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Recent Customer Interactions
          </CardTitle>
          <p className="text-sm text-gray-500">Latest customer engagement data with visual tracking</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredInteractions.slice(0, 10).map((interaction) => (
              <div key={interaction.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {getReactionIcon(interaction.customerReaction)}
                    <Badge className={getEngagementColor(interaction.engagementScore).replace('text-', 'bg-').replace('-600', '-100') + ' ' + getEngagementColor(interaction.engagementScore)}>
                      {interaction.engagementScore}%
                    </Badge>
                  </div>
                  <div>
                    <h4 className="font-medium">{interaction.mannequinName}</h4>
                    <p className="text-sm text-gray-600">{interaction.storeName} • {interaction.clothingCategory}</p>
                    <p className="text-xs text-gray-500">
                      {interaction.interactionDuration} min • {interaction.movementType} • {interaction.timestamp.toLocaleString()}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  {interaction.photoUrl && (
                    <Button variant="outline" size="sm" onClick={() => handlePhotoUpload(interaction)}>
                      <Camera className="w-4 h-4 mr-1" />
                      View Photo
                    </Button>
                  )}
                  <Button variant="outline" size="sm" onClick={() => handlePhotoUpload(interaction)}>
                    <Upload className="w-4 h-4 mr-1" />
                    Upload Photo
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Photo Upload Modal */}
      <Dialog open={showPhotoUpload} onOpenChange={setShowPhotoUpload}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Visual Tracking - Upload Photo</DialogTitle>
            <DialogDescription>
              Upload a photo of the RoboQuin appearance for visual engagement tracking
            </DialogDescription>
          </DialogHeader>
          {selectedInteraction && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Mannequin</Label>
                  <Input value={selectedInteraction.mannequinName} readOnly />
                </div>
                <div>
                  <Label>Store</Label>
                  <Input value={selectedInteraction.storeName} readOnly />
                </div>
                <div>
                  <Label>Clothing Category</Label>
                  <Input value={selectedInteraction.clothingCategory} readOnly />
                </div>
                <div>
                  <Label>Engagement Score</Label>
                  <Input value={`${selectedInteraction.engagementScore}%`} readOnly />
                </div>
              </div>
              
              <div>
                <Label>Photo Upload</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">Click to upload photo or drag and drop</p>
                  <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                </div>
              </div>
              
              <div>
                <Label>Notes</Label>
                <Textarea 
                  placeholder="Add notes about the visual appearance and customer engagement..."
                  rows={3}
                />
              </div>
              
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowPhotoUpload(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setShowPhotoUpload(false)}>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Photo
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 