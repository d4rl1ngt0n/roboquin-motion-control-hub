# OpenAI API Testing Guide

This guide explains how to test the OpenAI API integration in the RoboQuin Motion Control Hub.

## Test Files Created

1. **`test-openai.html`** - Browser-based test interface
2. **`test-openai.js`** - Node.js test script
3. **`test-openai.ts`** - TypeScript test script
4. **`src/components/OpenAITest.tsx`** - React component for in-app testing

## How to Test

### Option 1: Browser Test (Recommended)
1. Open `test-openai.html` in your browser
2. The page will automatically run a structure test
3. Optionally enter your OpenAI API key to test actual API calls
4. View results and logs in real-time

### Option 2: In-App Testing
1. Start the development server: `npm run dev`
2. Navigate to `http://localhost:5173/openai-test`
3. Use the React component interface to test the API

### Option 3: Command Line Testing
```bash
# Set your API key
export OPENAI_API_KEY="your-api-key-here"

# Run JavaScript test
node test-openai.js

# Run TypeScript test (if tsx is available)
npx tsx test-openai.ts
```

## What Gets Tested

### Structure Tests
- ✅ API class instantiation
- ✅ System prompt creation
- ✅ Conversation context creation
- ✅ Message formatting
- ✅ TypeScript type definitions

### API Tests
- ✅ Authentication with OpenAI
- ✅ Message sending and receiving
- ✅ Error handling
- ✅ Response parsing
- ✅ Rate limiting detection

## Test Scenarios

1. **Basic Structure Test**: Verifies all components are properly defined
2. **API Authentication Test**: Tests API key validation
3. **Message Generation Test**: Tests actual AI response generation
4. **Error Handling Test**: Tests various error scenarios
5. **Conversation Context Test**: Tests multi-turn conversation handling

## Expected Results

### Successful Test
```
✅ API Structure Test Passed - All components working correctly
✅ API Call Test Passed - Response received successfully
🤖 AI Response: [Actual AI response from OpenAI]
```

### Failed Test (Common Issues)
```
❌ OPENAI_API_KEY environment variable is not set
❌ OpenAI API Error: 401 - Invalid API key
❌ OpenAI API Error: 429 - Rate limit exceeded
```

## Troubleshooting

### Missing API Key
- Get an API key from [OpenAI Platform](https://platform.openai.com/api-keys)
- Set it as an environment variable or enter it in the test interface

### Authentication Errors
- Verify your API key is correct
- Check if your account has sufficient credits
- Ensure the API key has the necessary permissions

### Rate Limiting
- Wait a few minutes before retrying
- Consider upgrading your OpenAI plan if needed

### Network Issues
- Check your internet connection
- Verify firewall settings
- Try using a different network

## API Configuration

The OpenAI API is configured with these default settings:
- **Model**: `gpt-3.5-turbo`
- **Temperature**: `0.7`
- **Max Tokens**: `500`
- **Top P**: `1`
- **Streaming**: `false`

## System Prompt

The AI is configured with a comprehensive system prompt that defines it as "RoboQuin", a fashion assistant for retail stores. The prompt includes:
- Core identity and capabilities
- Communication style guidelines
- Response formatting rules
- Error handling instructions

## Next Steps

After successful testing:
1. Integrate the API into your main application
2. Add proper error handling and retry logic
3. Implement rate limiting and cost management
4. Add monitoring and logging
5. Consider implementing caching for common responses 