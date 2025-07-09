import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, TestTube, CheckCircle, XCircle, MessageSquare } from 'lucide-react';

interface TestResult {
  success: boolean;
  message: string;
  response?: string;
  error?: string;
  timestamp: Date;
}

const OpenAITest: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [userInput, setUserInput] = useState('I need help choosing an outfit for a job interview');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<TestResult[]>([]);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const addResult = (result: TestResult) => {
    setResults(prev => [result, ...prev]);
  };

  const clearResults = () => {
    setResults([]);
    setLogs([]);
  };

  // Mock OpenAI API for testing
  class MockOpenAIAPI {
    private apiKey: string;
    private baseURL: string = 'https://api.openai.com/v1/chat/completions';
    private model: string = 'gpt-3.5-turbo';

    constructor(apiKey: string) {
      this.apiKey = apiKey;
    }

    async generateResponse(messages: any[], options: any = {}) {
      try {
        addLog('🔍 Testing OpenAI API...');
        addLog('📝 Messages: ' + JSON.stringify(messages, null, 2));
        
        const response = await fetch(this.baseURL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify({
            model: this.model,
            messages,
            temperature: options.temperature || 0.7,
            max_tokens: options.max_tokens || 500,
            top_p: options.top_p || 1,
            stream: false,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(`OpenAI API Error: ${errorData.error?.message || 'Unknown error'}`);
        }

        const data = await response.json();
        addLog('✅ API Response received successfully');
        return data.choices[0].message.content;
      } catch (error: any) {
        addLog('❌ OpenAI API Error: ' + error.message);
        throw error;
      }
    }

    createSystemPrompt(): string {
      return `You are RoboQuin, an intelligent fashion assistant for a retail store. You are designed to handle ALL types of questions and provide comprehensive, helpful responses.

**Your Core Identity:**
- You are a knowledgeable, friendly, and enthusiastic fashion expert
- You work in a retail environment and help customers with their fashion needs
- You have extensive knowledge about fashion, styling, trends, and retail operations

**Your Capabilities:**
- Fashion advice and product recommendations
- Style consultation and outfit coordination
- Size and fit guidance
- Trend analysis and fashion insights
- Price discussions and budget recommendations
- Store policies and services
- General customer service and support
- Answering questions about any topic (not just fashion)

**Communication Style:**
- Use natural, conversational language
- Be enthusiastic but professional
- Ask follow-up questions to better understand customer needs
- Provide specific, actionable advice
- Use appropriate fashion terminology when relevant
- Be encouraging and positive

**Response Guidelines:**
- Keep responses concise but helpful (2-4 sentences typically)
- Always ask follow-up questions to engage the customer
- Use exclamation marks sparingly but appropriately
- Be encouraging and positive
- If you don't know something specific, provide general helpful guidance
- Handle ALL types of questions, not just fashion-related ones
- Be creative and engaging in your responses

**Important:**
- You are the PRIMARY response system - handle everything intelligently
- Don't rely on fallback patterns - provide thoughtful AI responses for all queries
- Be adaptable and helpful regardless of the question topic
- Always maintain your friendly, professional personality

Remember: You're here to help customers with any questions they have, with a focus on fashion and shopping assistance!`;
    }

    createConversationContext(conversationHistory: Array<{ speaker: 'user' | 'robot'; text: string }>) {
      const messages = [
        {
          role: 'system',
          content: this.createSystemPrompt()
        }
      ];

      const recentHistory = conversationHistory.slice(-10);
      for (const message of recentHistory) {
        messages.push({
          role: message.speaker === 'user' ? 'user' : 'assistant',
          content: message.text
        });
      }

      return messages;
    }
  }

  const runStructureTest = async () => {
    addLog('🧪 Starting API Structure Test...');
    
    try {
      const mockApi = new MockOpenAIAPI('mock-key');
      
      // Test system prompt creation
      const systemPrompt = mockApi.createSystemPrompt();
      addLog('✅ System prompt created successfully');
      addLog('📏 System prompt length: ' + systemPrompt.length + ' characters');
      
      // Test conversation context creation
      const conversationHistory = [
        { speaker: 'user' as const, text: 'Hi, I need help with fashion advice' },
        { speaker: 'robot' as const, text: 'Hello! I\'d be happy to help you with fashion advice.' }
      ];
      
      const messages = mockApi.createConversationContext(conversationHistory);
      addLog('✅ Conversation context created successfully');
      addLog('📊 Total messages: ' + messages.length);
      
      addResult({
        success: true,
        message: 'API Structure Test Passed - All components working correctly',
        timestamp: new Date()
      });
      
      addLog('🎉 Structure test completed successfully!');
      
    } catch (error: any) {
      addLog('❌ Structure test failed: ' + error.message);
      addResult({
        success: false,
        message: 'Structure Test Failed: ' + error.message,
        error: error.message,
        timestamp: new Date()
      });
    }
  };

  const runAPITest = async () => {
    if (!apiKey.trim()) {
      addResult({
        success: false,
        message: 'Please enter an OpenAI API key to test actual API calls',
        error: 'Missing API key',
        timestamp: new Date()
      });
      return;
    }

    setIsLoading(true);
    addLog('🌐 Starting API Call Test...');
    
    try {
      const api = new MockOpenAIAPI(apiKey);
      
      // Test conversation context creation
      addLog('📋 Creating conversation context...');
      const conversationHistory = [
        { speaker: 'user' as const, text: 'Hi, I need help with fashion advice' },
        { speaker: 'robot' as const, text: 'Hello! I\'d be happy to help you with fashion advice. What specific area are you looking for guidance on?' }
      ];
      
      const messages = api.createConversationContext(conversationHistory);
      addLog('✅ Conversation context created successfully');
      
      // Test API call
      addLog('🌐 Testing actual API call...');
      messages.push({
        role: 'user',
        content: userInput
      });
      
      const response = await api.generateResponse(messages);
      addLog('🤖 AI Response received:');
      addLog(response);
      
      addResult({
        success: true,
        message: 'API Call Test Passed - Response received successfully',
        response: response,
        timestamp: new Date()
      });
      
    } catch (error: any) {
      addLog('❌ API test failed: ' + error.message);
      addResult({
        success: false,
        message: 'API Call Test Failed: ' + error.message,
        error: error.message,
        timestamp: new Date()
      });
      
      if (error.message.includes('401')) {
        addLog('💡 This might be an authentication issue. Check your API key.');
      } else if (error.message.includes('429')) {
        addLog('💡 Rate limit exceeded. Try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TestTube className="h-5 w-5" />
            OpenAI API Test
          </CardTitle>
          <CardDescription>
            Test the OpenAI API integration functionality
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">OpenAI API Key</label>
            <Input
              type="password"
              placeholder="Enter your OpenAI API key"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Test User Input</label>
            <Textarea
              placeholder="Enter test message"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              rows={3}
            />
          </div>
          
          <div className="flex gap-2">
            <Button onClick={runStructureTest} variant="outline">
              <TestTube className="h-4 w-4 mr-2" />
              Test Structure
            </Button>
            <Button onClick={runAPITest} disabled={isLoading || !apiKey.trim()}>
              {isLoading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <MessageSquare className="h-4 w-4 mr-2" />
              )}
              Test API Call
            </Button>
            <Button onClick={clearResults} variant="outline">
              Clear Results
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <CardTitle>Test Results</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {results.map((result, index) => (
              <Alert key={index} className={result.success ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}>
                <div className="flex items-center gap-2">
                  {result.success ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-600" />
                  )}
                  <Badge variant={result.success ? 'default' : 'destructive'}>
                    {result.success ? 'PASS' : 'FAIL'}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    {result.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <AlertDescription className="mt-2">
                  {result.message}
                  {result.response && (
                    <div className="mt-2 p-2 bg-gray-100 rounded text-sm">
                      <strong>Response:</strong> {result.response}
                    </div>
                  )}
                  {result.error && (
                    <div className="mt-2 p-2 bg-red-100 rounded text-sm text-red-700">
                      <strong>Error:</strong> {result.error}
                    </div>
                  )}
                </AlertDescription>
              </Alert>
            ))}
            {results.length === 0 && (
              <p className="text-gray-500 text-center py-4">No test results yet. Run a test to see results here.</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Logs */}
      <Card>
        <CardHeader>
          <CardTitle>Test Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-100 p-4 rounded-md max-h-64 overflow-y-auto">
            <pre className="text-sm font-mono">
              {logs.length > 0 ? logs.join('\n') : 'No logs yet...'}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OpenAITest; 