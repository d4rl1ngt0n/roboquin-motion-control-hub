import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Send, 
  MessageCircle, 
  Bot, 
  User, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  Settings,
  HelpCircle,
  Smile,
  Image,
  Paperclip,
  Mic,
  Video,
  MoreHorizontal
} from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot' | 'agent';
  timestamp: Date;
  type: 'text' | 'image' | 'system';
  mannequinId?: string;
  isTyping?: boolean;
}

interface Mannequin {
  id: string;
  name: string;
  status: string;
  location: string;
}

interface CustomerChatProps {
  mannequins?: Mannequin[];
}

export function CustomerChat({ mannequins = [] }: CustomerChatProps) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your RoboQuin assistant. How can I help you today?',
      sender: 'bot',
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedMannequin, setSelectedMannequin] = useState<string>('all');
  const [chatStatus, setChatStatus] = useState<'active' | 'waiting' | 'resolved'>('active');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [showQuickActions, setShowQuickActions] = useState(false);

  const quickActions = [
    { text: 'Help with mannequin setup', icon: Settings },
    { text: 'Report a technical issue', icon: AlertCircle },
    { text: 'Schedule maintenance', icon: Clock },
    { text: 'Request motion preset', icon: Smile },
    { text: 'Billing question', icon: HelpCircle }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botResponse = generateBotResponse(inputMessage);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      };

      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 2000);
  };

  const generateBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();
    
    if (input.includes('help') || input.includes('support')) {
      return 'I\'m here to help! I can assist with mannequin setup, technical issues, maintenance scheduling, and more. What specific help do you need?';
    }
    
    if (input.includes('setup') || input.includes('install')) {
      return 'For mannequin setup, I\'ll need to know which specific mannequin you\'re working with. I can guide you through the installation process step by step.';
    }
    
    if (input.includes('issue') || input.includes('problem') || input.includes('error')) {
      return 'I\'m sorry to hear you\'re experiencing an issue. To help you better, could you describe the problem in detail? Also, please let me know which mannequin is affected.';
    }
    
    if (input.includes('maintenance') || input.includes('repair')) {
      return 'I can help you schedule maintenance for your mannequins. When would you like the maintenance to be performed? I\'ll coordinate with our technical team.';
    }
    
    if (input.includes('motion') || input.includes('preset')) {
      return 'I can help you with motion presets! We have several pre-programmed movements available, or I can help you create a custom one. What type of motion are you looking for?';
    }
    
    if (input.includes('billing') || input.includes('payment') || input.includes('invoice')) {
      return 'For billing questions, I can help you check your current plan, update payment methods, or explain charges. What billing information do you need?';
    }
    
    if (input.includes('status') || input.includes('online') || input.includes('offline')) {
      return 'I can check the status of your mannequins. Let me know which specific mannequin you\'d like me to check, or I can provide an overview of all your devices.';
    }
    
    return 'Thank you for your message! I\'m here to help with any questions about your RoboQuin mannequins. Could you please provide more details about what you need assistance with?';
  };

  const handleQuickAction = (action: string) => {
    setInputMessage(action);
    setShowQuickActions(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getMannequinStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'offline':
        return 'bg-red-500';
      case 'maintenance':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b p-4">
      <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/bot-avatar.png" />
                <AvatarFallback className="bg-blue-500 text-white">
                  <Bot className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full ${getMannequinStatusColor('online')}`}></div>
            </div>
        <div>
              <h2 className="font-semibold">RoboQuin Support</h2>
              <p className="text-sm text-gray-600">AI Assistant • Online</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={chatStatus === 'active' ? 'default' : 'secondary'}>
              {chatStatus === 'active' ? 'Active' : chatStatus === 'waiting' ? 'Waiting' : 'Resolved'}
            </Badge>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mannequin Selector */}
      {mannequins.length > 0 && (
        <div className="bg-white border-b p-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">Mannequin:</span>
            <Select value={selectedMannequin} onValueChange={setSelectedMannequin}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Mannequins</SelectItem>
                {mannequins.map(mannequin => (
                  <SelectItem key={mannequin.id} value={mannequin.id}>
                    {mannequin.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4 max-w-4xl mx-auto">
            {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex gap-3 max-w-[70%] ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <Avatar className="h-8 w-8">
                  <AvatarImage src={message.sender === 'user' ? '/user-avatar.png' : '/bot-avatar.png'} />
                  <AvatarFallback className={message.sender === 'user' ? 'bg-gray-500' : 'bg-blue-500 text-white'}>
                    {message.sender === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                  </AvatarFallback>
                </Avatar>
                <div className={`rounded-lg p-3 ${
                  message.sender === 'user' 
                    ? 'bg-blue-500 text-white' 
                    : message.sender === 'bot'
                    ? 'bg-white border'
                    : 'bg-gray-100'
                }`}>
                  <p className="text-sm">{message.text}</p>
                  <div className={`flex items-center gap-1 mt-1 text-xs ${
                    message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    <Clock className="h-3 w-3" />
                    {formatTime(message.timestamp)}
                    {message.sender === 'user' && (
                      <CheckCircle className="h-3 w-3 ml-1" />
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isTyping && (
            <div className="flex justify-start">
              <div className="flex gap-3 max-w-[70%]">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-blue-500 text-white">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-white border rounded-lg p-3">
                  <div className="flex items-center gap-1">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                    <span className="text-xs text-gray-500 ml-2">Typing...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Quick Actions */}
      {showQuickActions && (
        <div className="bg-white border-t p-4">
          <div className="max-w-4xl mx-auto">
            <p className="text-sm font-medium text-gray-700 mb-3">Quick Actions:</p>
            <div className="flex flex-wrap gap-2">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAction(action.text)}
                  className="flex items-center gap-2"
                >
                  <action.icon className="h-3 w-3" />
                  {action.text}
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

          {/* Input Area */}
      <div className="bg-white border-t p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowQuickActions(!showQuickActions)}
                >
                  <HelpCircle className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Paperclip className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Image className="h-4 w-4" />
                </Button>
              </div>
              <div className="relative">
              <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="pr-12"
                />
                <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
                  <Button variant="ghost" size="sm">
                    <Mic className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!inputMessage.trim()}
                    size="sm"
                  >
                    <Send className="h-4 w-4" />
              </Button>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
            <span>Press Enter to send, Shift+Enter for new line</span>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1">
                <Phone className="h-3 w-3" />
                Call Support
              </span>
              <span className="flex items-center gap-1">
                <Mail className="h-3 w-3" />
                Email Support
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 