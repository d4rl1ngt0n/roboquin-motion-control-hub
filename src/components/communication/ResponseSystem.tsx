import React, { useState, useCallback } from 'react';
import { generateAIResponse } from '@/api/openai';

// Minimal fallback responses for emergency use only
const emergencyFallbackResponses = {
  error: [
    "I'm having trouble connecting to my AI system right now. Please try again in a moment.",
    "I'm experiencing some technical difficulties. Could you please try your question again?",
    "I'm temporarily unable to access my full capabilities. Please wait a moment and try again.",
  ],
  default: [
    "I'm here to help with your fashion needs. Could you please tell me more about what you're looking for?",
    "I'd love to assist you with fashion advice. What specific help do you need today?",
    "I'm ready to help you find the perfect fashion items. What can I do for you?",
  ]
};

export function useResponseSystem() {
  const [conversationContext, setConversationContext] = useState<{
    lastTopic?: string;
    userPreferences?: string[];
    timeOfDay?: 'morning' | 'afternoon' | 'evening';
  }>({});

  const getTimeOfDay = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'morning';
    if (hour < 18) return 'afternoon';
    return 'evening';
  };

  const generateResponse = useCallback(async (
    text: string,
    conversationHistory: Array<{ speaker: 'user' | 'robot'; text: string }> = []
  ) => {
    const timeOfDay = getTimeOfDay();
    
    // Update conversation context
    setConversationContext(prev => ({
      ...prev,
      timeOfDay
    }));

    console.log('useResponseSystem: Attempting to generate AI response for:', text);
    console.log('useResponseSystem: Conversation history length:', conversationHistory.length);

    // Always try to use OpenAI API first
    try {
      console.log('useResponseSystem: Calling OpenAI API...');
      const aiResponse = await generateAIResponse(conversationHistory, text);
      console.log('useResponseSystem: AI Response received:', aiResponse);
      return aiResponse;
    } catch (error) {
      console.error('useResponseSystem: OpenAI API failed:', error);
      
      // Only use emergency fallback if AI is completely unavailable
      const errorResponse = emergencyFallbackResponses.error[
        Math.floor(Math.random() * emergencyFallbackResponses.error.length)
      ];
      console.log('useResponseSystem: Using error fallback:', errorResponse);
      return errorResponse;
    }
  }, []);

  return { generateResponse };
}

function getTimeOfDay() {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 18) return 'afternoon';
  return 'evening';
} 