import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  Send, 
  User, 
  Bot, 
  Loader2, 
  Sparkles, 
  MessageSquare,
  Mic,
  MicOff,
  Paperclip,
  Smile,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { generateAIResponse } from '@/api/openai';
import { toast } from 'sonner';

interface Message {
  id: string;
  speaker: 'user' | 'robot';
  text: string;
  timestamp: Date;
  isTyping?: boolean;
}

interface ChatInterfaceProps {
  customerName?: string;
  customerId?: string;
  onMessageSent?: (message: Message) => void;
  onConversationEnd?: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  customerName = 'Customer',
  customerId,
  onMessageSent,
  onConversationEnd
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      speaker: 'robot',
      text: `Hello! I'm RoboQuin, your personal fashion assistant. I'm here to help you with style advice, outfit recommendations, and any fashion questions you might have. What can I help you with today?`,
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  // Simulate typing indicator
  useEffect(() => {
    if (isTyping) {
      const timer = setTimeout(() => {
        setIsTyping(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isTyping]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      speaker: 'user',
      text: inputText.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);
    setIsTyping(true);

    // Notify parent component
    onMessageSent?.(userMessage);

    try {
      // Convert messages to the format expected by the API
      const conversationHistory = messages.map(msg => ({
        speaker: msg.speaker,
        text: msg.text
      }));

      const aiResponse = await generateAIResponse(conversationHistory, userMessage.text);
      
      const robotMessage: Message = {
        id: (Date.now() + 1).toString(),
        speaker: 'robot',
        text: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, robotMessage]);
      setIsTyping(false);
    } catch (error) {
      console.error('Error generating AI response:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        speaker: 'robot',
        text: "I apologize, but I'm having trouble connecting right now. Please try again in a moment, or feel free to ask me something else!",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      setIsTyping(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // TODO: Implement voice recording functionality
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getMessageBubbleClass = (speaker: 'user' | 'robot') => {
    return speaker === 'user' 
      ? 'bg-blue-500 text-white ml-auto' 
      : 'bg-gray-100 text-gray-900';
  };

  return (
    <Card className="w-full max-w-4xl mx-auto h-[600px] flex flex-col">
      <CardHeader className="border-b bg-gradient-to-r from-purple-500 to-pink-500 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/roboquin-avatar.png" alt="RoboQuin" />
              <AvatarFallback className="bg-white/20 text-white">
                <Sparkles className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">RoboQuin Fashion Assistant</CardTitle>
              <div className="flex items-center gap-2 text-sm opacity-90">
                <Badge variant="secondary" className="bg-white/20 text-white">
                  {isTyping ? 'Typing...' : 'Online'}
                </Badge>
                {customerName && (
                  <span>Chatting with {customerName}</span>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20"
              onClick={onConversationEnd}
            >
              End Chat
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 p-0 flex flex-col">
        <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.speaker === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.speaker === 'robot' && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/roboquin-avatar.png" alt="RoboQuin" />
                    <AvatarFallback className="bg-purple-100 text-purple-600">
                      <Sparkles className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
                
                <div className={`max-w-[70%] ${message.speaker === 'user' ? 'order-2' : 'order-1'}`}>
                  <div
                    className={`rounded-2xl px-4 py-2 ${getMessageBubbleClass(message.speaker)}`}
                  >
                    <p className="text-sm leading-relaxed">{message.text}</p>
                  </div>
                  <div className={`text-xs text-gray-500 mt-1 ${message.speaker === 'user' ? 'text-right' : 'text-left'}`}>
                    {formatTime(message.timestamp)}
                  </div>
                </div>

                {message.speaker === 'user' && (
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/user-avatar.png" alt="User" />
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      <User className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-3 justify-start">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/roboquin-avatar.png" alt="RoboQuin" />
                  <AvatarFallback className="bg-purple-100 text-purple-600">
                    <Sparkles className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-gray-100 rounded-2xl px-4 py-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <Separator />
        
        <div className="p-4">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={toggleRecording}
              className={isRecording ? 'text-red-500' : ''}
            >
              {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                toast.info('File attachment functionality coming soon');
              }}
            >
              <Paperclip className="h-4 w-4" />
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                toast.info('Emoji picker coming soon');
              }}
            >
              <Smile className="h-4 w-4" />
            </Button>
            
            <div className="flex-1 relative">
              <Input
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message here..."
                className="pr-12"
                disabled={isLoading}
              />
              <Button
                size="sm"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                onClick={handleSendMessage}
                disabled={!inputText.trim() || isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
          
          <div className="text-xs text-gray-500 mt-2 text-center">
            Press Enter to send, Shift+Enter for new line
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatInterface; 