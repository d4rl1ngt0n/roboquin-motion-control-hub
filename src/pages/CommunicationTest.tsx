import React from 'react';
import { RobotCommunication } from '@/components/communication/RobotCommunication';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, Zap, MessageSquare, Settings } from 'lucide-react';

export default function CommunicationTest() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-blue-600" />
            RoboQuin AI Communication System
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Experience the next generation of AI-powered fashion assistance. This system combines advanced speech recognition, 
              natural language processing, and OpenAI's GPT-3.5-turbo to provide intelligent, context-aware responses for a seamless shopping experience.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="h-4 w-4 text-blue-600" />
                  <h3 className="text-sm font-medium text-blue-800">OpenAI Powered</h3>
                </div>
                <p className="text-xs text-blue-700">
                  Powered by GPT-3.5-turbo for intelligent, context-aware responses
                </p>
              </div>
              
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="h-4 w-4 text-green-600" />
                  <h3 className="text-sm font-medium text-green-800">Smart Conversations</h3>
                </div>
                <p className="text-xs text-green-700">
                  Natural language understanding with conversation memory
                </p>
              </div>
              
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-4 w-4 text-purple-600" />
                  <h3 className="text-sm font-medium text-purple-800">Real-time Processing</h3>
                </div>
                <p className="text-xs text-purple-700">
                  Instant speech recognition and response generation
                </p>
              </div>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-yellow-800 mb-2">Getting Started:</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm text-yellow-700">
                <li>Click the <Settings className="h-4 w-4 inline" /> Settings button to configure your OpenAI API key</li>
                <li>Get your API key from <a href="https://platform.openai.com/" target="_blank" rel="noopener noreferrer" className="underline">OpenAI Platform</a></li>
                <li>Click "Start Listening" to begin speech recognition</li>
                <li>Speak clearly into your microphone</li>
                <li>Watch as GPT-3.5-turbo processes your request and responds intelligently</li>
                <li>Use the "Test Response" button to verify speech synthesis</li>
              </ol>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-800 mb-2">AI Capabilities:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-blue-700">
                <li>Advanced fashion advice and product recommendations</li>
                <li>Intelligent style consultation and outfit coordination</li>
                <li>Personalized size and fit guidance</li>
                <li>Real-time trend analysis and fashion insights</li>
                <li>Contextual conversation memory and understanding</li>
                <li>Natural language processing with GPT-3.5-turbo</li>
                <li>Comprehensive responses to ALL types of questions</li>
                <li>Emergency fallback only when AI is completely unavailable</li>
              </ul>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-green-800 mb-2">Example Conversations:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-green-700">
                <li>"I need a dress for a wedding next month"</li>
                <li>"What's trending this season for casual wear?"</li>
                <li>"Help me find something that matches my style"</li>
                <li>"What colors would work well with my skin tone?"</li>
                <li>"I'm looking for something under $100 but still stylish"</li>
                <li>"Can you suggest an outfit for a job interview?"</li>
                <li>"What's the weather like today?" (AI handles non-fashion questions too!)</li>
                <li>"Tell me a joke" (AI is versatile and engaging!)</li>
              </ul>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-purple-800 mb-2">Technical Features:</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-purple-700">
                <li>OpenAI GPT-3.5-turbo integration for all responses</li>
                <li>Web Speech API for real-time recognition</li>
                <li>Conversation history persistence</li>
                <li>Secure API key storage (local only)</li>
                <li>AI-first approach - no hard-coded responses</li>
                <li>Emergency fallback only when absolutely necessary</li>
                <li>Responsive design for all devices</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <RobotCommunication />
    </div>
  );
} 