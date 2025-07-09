import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, CheckCircle, AlertCircle, Key } from 'lucide-react';
import { initializeOpenAI, getOpenAIAPI } from '@/api/openai';

interface APISettingsProps {
  onAPIKeySet: (isSet: boolean) => void;
}

export function APISettings({ onAPIKeySet }: APISettingsProps) {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [validationStatus, setValidationStatus] = useState<'idle' | 'valid' | 'invalid' | 'error'>('idle');
  const [validationMessage, setValidationMessage] = useState('');

  useEffect(() => {
    // Load API key from localStorage on component mount
    const savedApiKey = localStorage.getItem('openai_api_key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
      initializeOpenAI(savedApiKey);
      onAPIKeySet(true);
      setValidationStatus('valid');
      setValidationMessage('API key loaded from storage');
    }
  }, [onAPIKeySet]);

  const handleApiKeyChange = (value: string) => {
    setApiKey(value);
    setValidationStatus('idle');
    setValidationMessage('');
  };

  const validateApiKey = async () => {
    if (!apiKey.trim()) {
      setValidationStatus('invalid');
      setValidationMessage('Please enter an API key');
      return;
    }

    setIsValidating(true);
    setValidationStatus('idle');
    setValidationMessage('Validating API key...');

    try {
      console.log('APISettings: Initializing OpenAI with provided key');
      // Initialize the API with the provided key
      initializeOpenAI(apiKey);
      
      // Test the API with a simple request
      const testMessages = [
        { role: 'user' as const, content: 'Hello' }
      ];
      
      const api = getOpenAIAPI();
      if (!api) {
        throw new Error('Failed to initialize API');
      }

      console.log('APISettings: Testing API with simple request');
      await api.generateResponse(testMessages, { max_tokens: 10 });
      
      // If successful, save to localStorage
      localStorage.setItem('openai_api_key', apiKey);
      setValidationStatus('valid');
      setValidationMessage('API key is valid and saved!');
      onAPIKeySet(true);
      console.log('APISettings: API key validated and saved successfully');
    } catch (error) {
      console.error('APISettings: API validation error:', error);
      setValidationStatus('error');
      setValidationMessage(error instanceof Error ? error.message : 'Failed to validate API key');
      onAPIKeySet(false);
    } finally {
      setIsValidating(false);
    }
  };

  const clearApiKey = () => {
    setApiKey('');
    localStorage.removeItem('openai_api_key');
    setValidationStatus('idle');
    setValidationMessage('');
    onAPIKeySet(false);
  };

  const getStatusIcon = () => {
    switch (validationStatus) {
      case 'valid':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'invalid':
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Key className="h-4 w-4 text-gray-400" />;
    }
  };

  const getStatusColor = () => {
    switch (validationStatus) {
      case 'valid':
        return 'text-green-600';
      case 'invalid':
      case 'error':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key className="h-5 w-5" />
          OpenAI API Configuration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="api-key">API Key</Label>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                id="api-key"
                type={showApiKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => handleApiKeyChange(e.target.value)}
                placeholder="Enter your OpenAI API key"
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3"
                onClick={() => setShowApiKey(!showApiKey)}
              >
                {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <Button
              onClick={validateApiKey}
              disabled={isValidating || !apiKey.trim()}
              className="min-w-[100px]"
            >
              {isValidating ? 'Validating...' : 'Validate'}
            </Button>
          </div>
        </div>

        {validationMessage && (
          <div className={`flex items-center gap-2 text-sm ${getStatusColor()}`}>
            {getStatusIcon()}
            <span>{validationMessage}</span>
          </div>
        )}

        <div className="flex gap-2">
          {validationStatus === 'valid' && (
            <Button
              variant="outline"
              onClick={clearApiKey}
              className="text-red-600 hover:text-red-700"
            >
              Clear API Key
            </Button>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2">How to get your API key:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm text-blue-700">
            <li>Visit <a href="https://platform.openai.com/" target="_blank" rel="noopener noreferrer" className="underline">OpenAI Platform</a></li>
            <li>Sign up or log in to your account</li>
            <li>Navigate to the API Keys section</li>
            <li>Generate a new API key</li>
            <li>Copy and paste it here</li>
          </ol>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-yellow-800 mb-2">Important Notes:</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-yellow-700">
            <li>Your API key is stored locally in your browser</li>
            <li>We use GPT-3.5-turbo for optimal performance and cost</li>
            <li>API usage will be charged according to OpenAI's pricing</li>
            <li>Keep your API key secure and don't share it</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
} 