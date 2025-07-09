import React, { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Volume2, VolumeX, Loader2 } from 'lucide-react';
import { useResponseSystem } from './ResponseSystem';

interface SpeechInterfaceProps {
  onSpeechRecognized: (text: string) => void;
  onResponseGenerated: (text: string) => void;
  isMuted?: boolean;
  isProcessing?: boolean;
}

export function SpeechInterface({ 
  onSpeechRecognized, 
  onResponseGenerated, 
  isMuted = false, 
  isProcessing = false 
}: SpeechInterfaceProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [recognizedText, setRecognizedText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const { generateResponse } = useResponseSystem();

  useEffect(() => {
    // Initialize speech recognition
    if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
        setError(null);
      };

      recognition.onend = () => {
        setIsListening(false);
        // If we have recognized text, process it
        if (recognizedText.trim()) {
          onSpeechRecognized(recognizedText.trim());
          setRecognizedText('');
        }
      };

      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map(result => result[0].transcript)
          .join('');
        setRecognizedText(transcript);
      };

      recognition.onerror = (event) => {
        setError(`Error: ${event.error}`);
        setIsListening(false);
      };

      setRecognition(recognition);
    } else {
      setError('Speech recognition is not supported in your browser.');
    }

    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [onSpeechRecognized]);

  const toggleListening = useCallback(() => {
    if (!recognition || isProcessing) return;

    if (isListening) {
      recognition.stop();
    } else {
      setRecognizedText('');
      recognition.start();
    }
  }, [recognition, isListening, isProcessing]);

  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window && !isMuted) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
      onResponseGenerated(text);
    } else if (isMuted) {
      // If muted, just update the UI without speaking
      onResponseGenerated(text);
    } else {
      setError('Speech synthesis is not supported in your browser.');
    }
  }, [onResponseGenerated, isMuted]);

  const handleTestResponse = useCallback(async () => {
    try {
      const testResponse = await generateResponse("test");
      speak(testResponse);
    } catch (error) {
      console.error('Error generating test response:', error);
      setError('Failed to generate test response');
    }
  }, [generateResponse, speak]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button
          onClick={toggleListening}
          disabled={!recognition || isProcessing}
          className={`flex items-center gap-2 ${
            isListening ? 'bg-red-500 hover:bg-red-600' : ''
          }`}
        >
          {isListening ? (
            <>
              <MicOff className="h-4 w-4" />
              Stop Listening
            </>
          ) : (
            <>
              <Mic className="h-4 w-4" />
              Start Listening
            </>
          )}
        </Button>

        <Button
          onClick={handleTestResponse}
          variant="outline"
          className="flex items-center gap-2"
          disabled={isProcessing}
        >
          <Volume2 className="h-4 w-4" />
          Test Response
        </Button>

        {isProcessing && (
          <div className="flex items-center gap-2 text-blue-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Processing...</span>
          </div>
        )}
      </div>

      {recognizedText && (
        <div className="p-4 bg-gray-100 rounded-lg">
          <p className="text-sm font-medium mb-1">Recognized Text:</p>
          <p className="text-sm">{recognizedText}</p>
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-100 text-red-700 rounded-lg">
          <p className="text-sm">{error}</p>
        </div>
      )}

      {isSpeaking && (
        <div className="p-4 bg-green-100 text-green-700 rounded-lg">
          <p className="text-sm">Speaking...</p>
        </div>
      )}
    </div>
  );
} 