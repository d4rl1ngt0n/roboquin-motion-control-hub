import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SpeechInterface } from './SpeechInterface';
import { useResponseSystem } from './ResponseSystem';
import { APISettings } from './APISettings';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2, VolumeX, Settings, Brain } from 'lucide-react';

interface ConversationMessage {
  speaker: 'user' | 'robot';
  text: string;
  timestamp: Date;
  context?: {
    topic?: string;
    emotion?: string;
    intent?: string;
    source?: 'ai' | 'fallback';
  };
}

export function RobotCommunication() {
  const [conversation, setConversation] = useState<ConversationMessage[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isApiConfigured, setIsApiConfigured] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { generateResponse } = useResponseSystem();

  // Load conversation history from localStorage
  useEffect(() => {
    const savedConversation = localStorage.getItem('robotConversation');
    if (savedConversation) {
      const parsed = JSON.parse(savedConversation);
      setConversation(parsed.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      })));
    }
  }, []);

  // Check if API is already configured on mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem('openai_api_key');
    console.log('RobotCommunication: Checking for saved API key:', savedApiKey ? 'Found' : 'Not found');
    if (savedApiKey) {
      console.log('RobotCommunication: Initializing OpenAI with saved API key');
      setIsApiConfigured(true);
      // Import and initialize the API
      import('@/api/openai').then(({ initializeOpenAI }) => {
        initializeOpenAI(savedApiKey);
        console.log('RobotCommunication: OpenAI API initialized');
      });
    } else {
      console.log('RobotCommunication: No API key found, AI will not be available');
    }
  }, []);

  // Save conversation history to localStorage
  useEffect(() => {
    localStorage.setItem('robotConversation', JSON.stringify(conversation));
  }, [conversation]);

  const handleSpeechRecognized = useCallback(async (text: string) => {
    // Add user's speech to conversation
    const userMessage: ConversationMessage = {
      speaker: 'user',
      text,
      timestamp: new Date(),
      context: {
        intent: 'user_input'
      }
    };
    setConversation(prev => [...prev, userMessage]);
    
    setIsProcessing(true);
    
    try {
      // Generate response using the enhanced system
      const response = await generateResponse(text, conversation);
      
      // Determine the source of the response
      let responseSource: 'ai' | 'fallback' = 'ai';
      let responseIntent: string = 'response';
      
      // Check if this is an emergency fallback response
      const isEmergencyFallback = response.includes('trouble connecting') || 
                                 response.includes('technical difficulties') || 
                                 response.includes('temporarily unable');
      
      if (isEmergencyFallback) {
        responseSource = 'fallback';
        responseIntent = 'error';
      }
      
      const robotMessage: ConversationMessage = {
        speaker: 'robot',
        text: response,
        timestamp: new Date(),
        context: {
          intent: responseIntent,
          source: responseSource
        }
      };
      setConversation(prev => [...prev, robotMessage]);
    } catch (error) {
      console.error('Error generating response:', error);
      const errorMessage: ConversationMessage = {
        speaker: 'robot',
        text: "I'm sorry, I'm having trouble processing your request right now. Please try again.",
        timestamp: new Date(),
        context: {
          intent: 'error',
          source: 'fallback'
        }
      };
      setConversation(prev => [...prev, errorMessage]);
    } finally {
      setIsProcessing(false);
    }
  }, [generateResponse, conversation, isApiConfigured]);

  const clearConversation = useCallback(() => {
    setConversation([]);
    localStorage.removeItem('robotConversation');
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => !prev);
  }, []);

  const toggleSettings = useCallback(() => {
    setShowSettings(prev => !prev);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Brain className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold">RoboQuin Assistant</h2>
          {isApiConfigured && (
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
              AI Powered
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={toggleSettings}
            title="API Settings"
          >
            <Settings className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleMute}
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </Button>
          <Button
            variant="outline"
            onClick={clearConversation}
          >
            Clear History
          </Button>
        </div>
      </div>

      {showSettings && (
        <APISettings onAPIKeySet={setIsApiConfigured} />
      )}

      <SpeechInterface
        onSpeechRecognized={handleSpeechRecognized}
        onResponseGenerated={() => {}}
        isMuted={isMuted}
        isProcessing={isProcessing}
      />

      <Card>
        <CardHeader>
          <CardTitle>Conversation History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {conversation.map((message, index) => (
              <div
                key={index}
                className={`p-4 rounded-lg ${
                  message.speaker === 'user'
                    ? 'bg-blue-100 ml-4'
                    : 'bg-green-100 mr-4'
                }`}
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium">
                      {message.speaker === 'user' ? 'You' : 'RoboQuin'}:
                    </p>
                    {message.context?.source && (
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        message.context.source === 'ai' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {message.context.source === 'ai' ? 'AI' : 'Basic'}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">
                    {message.timestamp.toLocaleTimeString()}
                  </p>
                </div>
                <p className="text-sm">{message.text}</p>
                {message.context?.intent && (
                  <p className="text-xs text-gray-500 mt-1">
                    Intent: {message.context.intent}
                  </p>
                )}
              </div>
            ))}
            {isProcessing && (
              <div className="p-4 bg-yellow-100 rounded-lg">
                <p className="text-sm text-yellow-700">Processing your request...</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 