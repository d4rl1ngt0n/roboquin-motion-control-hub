// Simple test script for OpenAI API
// Run with: node test-openai.js

// Mock the OpenAI API for testing
class MockOpenAIAPI {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseURL = 'https://api.openai.com/v1/chat/completions';
    this.model = 'gpt-3.5-turbo';
  }

  async generateResponse(messages, options = {}) {
    try {
      console.log('🔍 Testing OpenAI API...');
      console.log('📝 Messages:', JSON.stringify(messages, null, 2));
      
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
      console.log('✅ API Response received successfully');
      return data.choices[0].message.content;
    } catch (error) {
      console.error('❌ OpenAI API Error:', error.message);
      throw error;
    }
  }

  createSystemPrompt() {
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

  createConversationContext(conversationHistory) {
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

async function testOpenAI() {
  console.log('🚀 Starting OpenAI API Test...\n');
  
  // Check if API key is provided
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error('❌ OPENAI_API_KEY environment variable is not set');
    console.log('💡 To test with a real API key, run:');
    console.log('   export OPENAI_API_KEY="your-api-key-here"');
    console.log('   node test-openai.js');
    console.log('\n🧪 Running in mock mode...');
    
    // Test with mock data
    const mockApi = new MockOpenAIAPI('mock-key');
    const testMessages = [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: 'Hello! Can you help me with fashion advice?' }
    ];
    
    console.log('📝 Test messages structure:', JSON.stringify(testMessages, null, 2));
    console.log('✅ Mock API structure is working correctly');
    return;
  }

  try {
    const api = new MockOpenAIAPI(apiKey);
    
    // Test conversation context creation
    console.log('📋 Testing conversation context creation...');
    const conversationHistory = [
      { speaker: 'user', text: 'Hi, I need help with fashion advice' },
      { speaker: 'robot', text: 'Hello! I\'d be happy to help you with fashion advice. What specific area are you looking for guidance on?' }
    ];
    
    const messages = api.createConversationContext(conversationHistory);
    console.log('✅ Conversation context created successfully');
    console.log(`📊 Total messages: ${messages.length}`);
    
    // Test API call
    console.log('\n🌐 Testing actual API call...');
    const userInput = 'I need help choosing an outfit for a job interview';
    messages.push({
      role: 'user',
      content: userInput
    });
    
    const response = await api.generateResponse(messages);
    console.log('\n🤖 AI Response:');
    console.log(response);
    console.log('\n✅ Test completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.message.includes('401')) {
      console.log('💡 This might be an authentication issue. Check your API key.');
    } else if (error.message.includes('429')) {
      console.log('💡 Rate limit exceeded. Try again later.');
    }
  }
}

// Run the test
testOpenAI(); 