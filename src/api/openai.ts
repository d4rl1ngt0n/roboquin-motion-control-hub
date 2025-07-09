interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

interface OpenAIResponse {
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

interface OpenAIError {
  error: {
    message: string;
    type: string;
    code: string;
  };
}

class OpenAIAPI {
  private apiKey: string;
  private baseURL: string = 'https://api.openai.com/v1/chat/completions';
  private model: string = 'gpt-3.5-turbo';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateResponse(
    messages: OpenAIMessage[],
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
        const errorData: OpenAIError = await response.json();
        throw new Error(`OpenAI API Error: ${errorData.error.message}`);
      }

      const data: OpenAIResponse = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('OpenAI API Error:', error);
      throw error;
    }
  }

  // Enhanced system prompt for comprehensive AI responses
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

  // Helper method to create conversation context
  createConversationContext(conversationHistory: Array<{ speaker: 'user' | 'robot'; text: string }>): OpenAIMessage[] {
    const messages: OpenAIMessage[] = [
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
let openaiAPI: OpenAIAPI | null = null;

export function initializeOpenAI(apiKey: string): void {
  openaiAPI = new OpenAIAPI(apiKey);
}

export function getOpenAIAPI(): OpenAIAPI | null {
  return openaiAPI;
}

export async function generateAIResponse(
  conversationHistory: Array<{ speaker: 'user' | 'robot'; text: string }>,
  userInput: string
): Promise<string> {
  console.log('OpenAI API: generateAIResponse called with:', { userInput, conversationHistoryLength: conversationHistory.length });
  
  const api = getOpenAIAPI();
  if (!api) {
    console.error('OpenAI API: API not initialized');
    throw new Error('OpenAI API not initialized. Please provide an API key.');
  }

  console.log('OpenAI API: Creating conversation context...');
  const messages = api.createConversationContext(conversationHistory);
  messages.push({
    role: 'user',
    content: userInput
  });

  console.log('OpenAI API: Sending request with messages:', messages);
  const response = await api.generateResponse(messages);
  console.log('OpenAI API: Response received:', response);
  
  return response;
} 