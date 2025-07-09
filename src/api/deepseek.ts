interface DeepSeekMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface DeepSeekResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

interface DeepSeekError {
  error: {
    message: string;
    type: string;
    code: string;
  };
}

class DeepSeekAPI {
  private apiKey: string;
  private baseURL: string = 'https://api.deepseek.com/v1/chat/completions';
  private model: string = 'deepseek-chat';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateResponse(
    messages: DeepSeekMessage[],
    options: {
      temperature?: number;
      max_tokens?: number;
      top_p?: number;
    } = {}
  ): Promise<string> {
    try {
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
        const errorData: DeepSeekError = await response.json();
        throw new Error(`DeepSeek API Error: ${errorData.error.message}`);
      }

      const data: DeepSeekResponse = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('DeepSeek API Error:', error);
      throw error;
    }
  }

  // Helper method to create system prompt for RoboQuin
  createSystemPrompt(): string {
    return `You are RoboQuin, an intelligent fashion assistant for a retail store. You have the following characteristics:

1. **Personality**: Friendly, professional, enthusiastic, and knowledgeable about fashion
2. **Expertise**: Fashion trends, styling advice, product recommendations, size guidance
3. **Context**: You work in a retail environment and help customers with their fashion needs
4. **Communication Style**: 
   - Use natural, conversational language
   - Be enthusiastic but professional
   - Ask follow-up questions to better understand customer needs
   - Provide specific, actionable advice
   - Use fashion terminology appropriately

5. **Capabilities**:
   - Product recommendations based on style preferences
   - Size and fit guidance
   - Fashion trend information
   - Styling advice and outfit coordination
   - Price range discussions
   - Store policies and services

6. **Response Guidelines**:
   - Keep responses concise but helpful (max 2-3 sentences)
   - Always ask follow-up questions to engage the customer
   - Use exclamation marks sparingly but appropriately
   - Be encouraging and positive
   - If you don't know something, suggest asking a store associate

Remember: You're here to help customers find the perfect fashion items and have a great shopping experience!`;
  }

  // Helper method to create conversation context
  createConversationContext(conversationHistory: Array<{ speaker: 'user' | 'robot'; text: string }>): DeepSeekMessage[] {
    const messages: DeepSeekMessage[] = [
      {
        role: 'system',
        content: this.createSystemPrompt()
      }
    ];

    // Add conversation history (limit to last 10 messages to manage token usage)
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

// Export a singleton instance
let deepseekAPI: DeepSeekAPI | null = null;

export function initializeDeepSeek(apiKey: string): void {
  deepseekAPI = new DeepSeekAPI(apiKey);
}

export function getDeepSeekAPI(): DeepSeekAPI | null {
  return deepseekAPI;
}

export async function generateAIResponse(
  conversationHistory: Array<{ speaker: 'user' | 'robot'; text: string }>,
  userInput: string
): Promise<string> {
  const api = getDeepSeekAPI();
  if (!api) {
    throw new Error('DeepSeek API not initialized. Please provide an API key.');
  }

  const messages = api.createConversationContext(conversationHistory);
  messages.push({
    role: 'user',
    content: userInput
  });

  return await api.generateResponse(messages);
} 