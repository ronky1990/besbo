const OpenAI = require('openai');
const { Anthropic } = require('@anthropic-ai/sdk');
const axios = require('axios');

// Try to import Google Generative AI, but don't fail if it's not installed
let GoogleGenerativeAI;
try {
  const { GoogleGenerativeAI: GoogleAI } = require('@google/generative-ai');
  GoogleGenerativeAI = GoogleAI;
} catch (error) {
  console.warn('Google Generative AI package not found. Gemini models will not be available.');
}

// Try to import Cohere, but don't fail if it's not installed
let CohereClient;
try {
  const { CohereClient: Cohere } = require('cohere-ai');
  CohereClient = Cohere;
} catch (error) {
  console.warn('Cohere package not found. Cohere models will not be available.');
}

// Function to generate code using selected AI model
exports.generateCode = async (req, res) => {
  try {
    const { prompt, model, apiKey, provider, apiUrl } = req.body;
    
    if (!prompt || !model || !provider) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    // API key is required for most providers except Ollama (which might be local)
    if (!apiKey && !['ollama', 'local'].includes(provider)) {
      return res.status(400).json({ error: 'API key is required' });
    }
    
    // API URL is required for local and Ollama
    if (['ollama', 'local'].includes(provider) && !apiUrl) {
      return res.status(400).json({ error: 'API URL is required for this provider' });
    }
    
    // Enhanced prompt with prompt engineering
    const enhancedPrompt = await enhancePrompt(prompt);
    
    let response;
    
    switch (provider) {
      case 'openai':
        response = await generateWithOpenAI(enhancedPrompt, model, apiKey);
        break;
      case 'anthropic':
        response = await generateWithAnthropic(enhancedPrompt, model, apiKey);
        break;
      case 'gemini':
        if (!GoogleGenerativeAI) {
          return res.status(400).json({ 
            error: 'Gemini models are not available. Please install the @google/generative-ai package.' 
          });
        }
        response = await generateWithGemini(enhancedPrompt, model, apiKey);
        break;
      case 'cohere':
        if (!CohereClient) {
          return res.status(400).json({ 
            error: 'Cohere models are not available. Please install the cohere-ai package.' 
          });
        }
        response = await generateWithCohere(enhancedPrompt, model, apiKey);
        break;
      case 'ollama':
        response = await generateWithOllama(enhancedPrompt, model, apiUrl, apiKey);
        break;
      case 'local':
        response = await generateWithLocalAPI(enhancedPrompt, model, apiUrl, apiKey);
        break;
      default:
        return res.status(400).json({ error: 'Unsupported AI provider' });
    }
    
    res.json({ result: response });
  } catch (error) {
    console.error('Error generating code:', error);
    res.status(500).json({ 
      error: 'Failed to generate code', 
      details: error.message 
    });
  }
};

// Enhance the user prompt with prompt engineering
async function enhancePrompt(originalPrompt) {
  try {
    const enhancementTemplate = `
      Create a complete, working software project with the following specifications:
      
      ${originalPrompt}
      
      Please organize your response in the following structure:
      
      1. First, provide a project_structure.md file that lists:
         - Complete directory tree structure
         - List of all files to be created
         - Dependencies and versions needed
      
      2. Then, provide each source file with:
         - Exact file path and name following framework/language conventions
         - Complete, working code
         - Brief comment header explaining the file's purpose
      
      3. Finally, provide:
         - README.md with setup instructions and usage examples
         - Any necessary configuration files (.env.example, package.json, etc.)
      
      Important:
      - Use proper file naming conventions for each technology
      - Follow framework-specific directory structures
      - Include all necessary configuration files
      - Ensure file extensions match the language/framework
      - Organize files in appropriate directories (src, tests, config, etc.)
      
      Format each file as a code block starting with the full file path, like:
      \`\`\`filepath/filename.ext
      [file contents]
      \`\`\`
    `;
    
    return enhancementTemplate.trim();
  } catch (error) {
    console.error('Error enhancing prompt:', error);
    return originalPrompt;
  }
}

// Generate code using OpenAI
async function generateWithOpenAI(prompt, model, apiKey) {
  const openai = new OpenAI({ apiKey });
  
  const systemPrompt = `You are a senior software principal architect and professional AI agent developer specializing in creating complete applications.
  Your task is to create all the files needed for a fully functional application based on the request.
  
  You should:
  - Analyze the user query and enrich it with necessary context and constraints
  - Generate complete, working code for all necessary files
  - Include proper imports and dependencies
  - Ensure the code follows best practices and modern standards
  - Provide clear file structure with appropriate file paths
  - Support all languages, libraries, and frameworks as needed
  - Make the solution self-contained and use professional language
  - Arrange the files in the correct hierarchy for each technology
  - Write the file names as per the development standard for each framework/language
  - create a readme.md file with the project description and the files that are created
  - files should be in the correct format for the technology
  - files should be in the correct language and name of file should be in the correct format
  - highlight the files that are new or modified
  
  Format your response as a collection of files with clear file paths and complete code.`;
  
  const response = await openai.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: prompt }
    ],
    temperature: 0.7,
    max_tokens: 4000
  });
  
  return response.choices[0].message.content;
}

// Generate code using Anthropic
async function generateWithAnthropic(prompt, model, apiKey) {
  try {
    // Create a new Anthropic client with the provided API key
    const anthropic = new Anthropic({
      apiKey: apiKey,
    });
    
    // Check if the client was created successfully
    if (!anthropic) {
      throw new Error('Failed to initialize Anthropic client');
    }
    
    // Log the model being used
    console.log(`Using Anthropic model: ${model}`);
    
    // Use the model as is - no mapping needed since we're using correct IDs in the UI
    const systemPrompt = `You are a senior software principal architect and professional AI agent developer specializing in creating complete applications.
    Your task is to create all the files needed for a fully functional application based on the request.
    
    You should:
    - Analyze the user query and enrich it with necessary context and constraints
    - Generate complete, working code for all necessary files
    - Include proper imports and dependencies
    - Ensure the code follows best practices and modern standards
    - Provide clear file structure with appropriate file paths
    - Support all languages, libraries, and frameworks as needed
    - Make the solution self-contained and use professional language
    - Arrange the files in the correct hierarchy for each technology
    - Write the file names as per the development standard for each framework/language
    - create a readme.md file with the project description and the files that are created
    - files should be in the correct format for the technology
    - files should be in the correct language and name of file should be in the correct format
    - highlight the files that are new or modified
    - Write and arrange the file names according to the development standard.
    
    Format your response as a collection of files with clear file paths and complete code.`;
    
    // Create the message with proper error handling
    const response = await anthropic.messages.create({
      model: model,
      system: systemPrompt,
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 4000
    });
    
    // Check if the response has the expected structure
    if (!response || !response.content || !response.content[0]) {
      throw new Error('Unexpected response format from Anthropic API');
    }
    
    return response.content[0].text;
  } catch (error) {
    console.error('Error in Anthropic API call:', error);
    
    // Provide more specific error messages based on error type
    if (error.status === 404 && error.error?.error?.type === 'not_found_error') {
      throw new Error(`Anthropic API error: Model "${model}" not found. Please check the available models in your Anthropic account.`);
    } else if (error.status === 401) {
      throw new Error('Anthropic API error: Invalid API key. Please check your API key and try again.');
    } else {
      throw new Error(`Anthropic API error: ${error.message}`);
    }
  }
}

// Generate code using Google's Gemini
async function generateWithGemini(prompt, model, apiKey) {
  const genAI = new GoogleGenerativeAI(apiKey);
  const geminiModel = genAI.getGenerativeModel({ model });
  
  const systemPrompt = `You are a senior software principal architect and professional AI agent developer specializing in creating complete applications.
  Your task is to create all the files needed for a fully functional application based on the request.
  
  You should:
  - Analyze the user query and enrich it with necessary context and constraints
  - Generate complete, working code for all necessary files
  - Include proper imports and dependencies
  - Ensure the code follows best practices and modern standards
  - Provide clear file structure with appropriate file paths
  - Support all languages, libraries, and frameworks as needed
  - Make the solution self-contained and use professional language
  - Arrange the files in the correct hierarchy for each technology
  - Write the file names as per the development standard for each framework/language
  - files should be in the correct format for the technology
  - files should be in the correct language and name of file should be in the correct format
  - highlight the files that are new or modified
  - Write and arrange the file names according to the development standard.
  - Write the code in the correct language for the technology
  - Create a file with the hierarchy of files and folders in the project called readme.md
  
  Format your response as a collection of files with clear file paths and complete code.`;
  
  const result = await geminiModel.generateContent({
    contents: [{ role: 'user', parts: [{ text: `${systemPrompt}\n\n${prompt}` }] }],
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 8192,
    },
  });
  
  return result.response.text();
}

// Generate code using Cohere
async function generateWithCohere(prompt, model, apiKey) {
  const cohere = new CohereClient({ apiKey });
  
  const systemPrompt = `You are a senior software principal architect and professional AI agent developer specializing in creating complete applications.
  Your task is to create all the files needed for a fully functional application based on the request.
  
  You should:
  - Analyze the user query and enrich it with necessary context and constraints
  - Generate complete, working code for all necessary files
  - Include proper imports and dependencies
  - Ensure the code follows best practices and modern standards
  - Provide clear file structure with appropriate file paths
  - Support all languages, libraries, and frameworks as needed
  - Make the solution self-contained and use professional language
  - Arrange the files in the correct hierarchy for each technology
  - Write the file names as per the development standard for each framework/language
  - create a readme.md file with the project description and the files that are created
  - files should be in the correct format for the technology
  - files should be in the correct language and name of file should be in the correct format
  - highlight the files that are new or modified`;
  
  const response = await cohere.generate({
    model,
    prompt: `${systemPrompt}\n\n${prompt}`,
    max_tokens: 4000,
    temperature: 0.7,
  });
  
  return response.generations[0].text;
}

// Generate code using Ollama
async function generateWithOllama(prompt, model, apiUrl, apiKey = null) {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  // Add API key to headers if provided
  if (apiKey) {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }
  
  const systemPrompt = `You are a senior software principal architect and professional AI agent developer specializing in creating complete applications.
  Your task is to create all the files needed for a fully functional application based on the request.
  
  You should:
  - Analyze the user query and enrich it with necessary context and constraints
  - Generate complete, working code for all necessary files
  - Include proper imports and dependencies
  - Ensure the code follows best practices and modern standards
  - Provide clear file structure with appropriate file paths
  - Support all languages, libraries, and frameworks as needed
  - Make the solution self-contained and use professional language
  - Arrange the files in the correct hierarchy for each technology
  - Write the file names as per the development standard for each framework/language
  - create a readme.md file with the project description and the files that are created
  - files should be in the correct format for the technology
  - files should be in the correct language and name of file should be in the correct format
  - highlight the files that are new or modified`;
  
  const response = await axios.post(
    `${apiUrl}/generate`,
    {
      model,
      prompt: `${systemPrompt}\n\n${prompt}`,
      stream: false,
    },
    { headers }
  );
  
  return response.data.response;
}

// Generate code using a custom local API
async function generateWithLocalAPI(prompt, model, apiUrl, apiKey = null) {
  const headers = {
    'Content-Type': 'application/json',
  };
  
  // Add API key to headers if provided
  if (apiKey) {
    headers['Authorization'] = `Bearer ${apiKey}`;
  }
  
  const systemPrompt = `You are a senior software principal architect and professional AI agent developer specializing in creating complete applications.
  Your task is to create all the files needed for a fully functional application based on the request.
  
  You should:
  - Analyze the user query and enrich it with necessary context and constraints
  - Generate complete, working code for all necessary files
  - Include proper imports and dependencies
  - Ensure the code follows best practices and modern standards
  - Provide clear file structure with appropriate file paths
  - Support all languages, libraries, and frameworks as needed
  - Make the solution self-contained and use professional language
  - Arrange the files in the correct hierarchy for each technology
  - Write the file names as per the development standard for each framework/language
  - create a readme.md file with the project description and the files that are created
  - files should be in the correct format for the technology
  - files should be in the correct language and name of file should be in the correct format
  - highlight the files that are new or modified`;
  
  try {
    const response = await axios.post(
      apiUrl,
      {
        model: model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
        max_tokens: 4000
      },
      { headers }
    );
    
    // Handle different response formats
    if (response.data.choices && response.data.choices[0].message) {
      return response.data.choices[0].message.content;
    } else if (response.data.content) {
      return response.data.content;
    } else if (response.data.response) {
      return response.data.response;
    } else if (response.data.text) {
      return response.data.text;
    } else {
      return JSON.stringify(response.data);
    }
  } catch (error) {
    console.error('Error with local API:', error);
    throw new Error(`Failed to generate with local API: ${error.message}`);
  }
} 