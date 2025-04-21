import React, { useState } from 'react';
import axios from 'axios';
import Header from './components/Header';
import PromptInput from './components/PromptInput';
import ModelSelector from './components/ModelSelector';
import ApiKeyInput from './components/ApiKeyInput';
import CodeOutput from './components/CodeOutput';
import Footer from './components/Footer';

function App() {
  const [selectedProvider, setSelectedProvider] = useState('openai');
  const [selectedModel, setSelectedModel] = useState('gpt-4o');
  const [apiKey, setApiKey] = useState('');
  const [apiUrl, setApiUrl] = useState('');
  const [prompt, setPrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerateCode = async () => {
    if (!prompt) {
      setError('Please enter a prompt');
      return;
    }

    if (!apiKey && !['ollama', 'local'].includes(selectedProvider)) {
      setError('Please enter an API key');
      return;
    }

    if (['ollama', 'local'].includes(selectedProvider) && !apiUrl) {
      setError('Please enter an API URL');
      return;
    }

    setIsLoading(true);
    setError('');
    
    try {
      console.log('Sending request with:', { prompt, model: selectedModel, provider: selectedProvider });
      const response = await axios.post('/generate', {
        prompt,
        model: selectedModel,
        apiKey,
        provider: selectedProvider,
        apiUrl
      });
      
      console.log('Received response:', response.data);
      setGeneratedCode(response.data.result);
    } catch (error) {
      console.error('Error generating code:', error);
      if (error.response) {
        console.error('Response data:', error.response.data);
        console.error('Response status:', error.response.status);
        console.error('Response headers:', error.response.headers);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error setting up request:', error.message);
      }
      setError(error.response?.data?.details || 'Failed to generate code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary flex flex-col">
      <Header />
      
      <main className="flex-grow py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold gradient-text font-heading">AI Code Generator</h1>
            <p className="mt-3 text-xl text-accent">Generate complete applications with AI</p>
          </div>
          
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            <div className="col-span-1 bg-secondary-light p-6 rounded-lg shadow-xl border border-primary/20">
              <h2 className="text-2xl font-bold text-primary font-heading">Settings</h2>
              <ModelSelector 
                selectedProvider={selectedProvider}
                setSelectedProvider={setSelectedProvider}
                selectedModel={selectedModel}
                setSelectedModel={setSelectedModel}
              />
              <ApiKeyInput 
                apiKey={apiKey} 
                setApiKey={setApiKey}
                apiUrl={apiUrl}
                setApiUrl={setApiUrl}
                provider={selectedProvider}
              />
            </div>
            
            <div className="col-span-1 md:col-span-2">
              <div className="bg-secondary-light p-6 rounded-lg shadow-xl border border-primary/20 mb-8">
                <h2 className="text-2xl font-bold text-primary font-heading">Prompt</h2>
                <PromptInput 
                  prompt={prompt} 
                  setPrompt={setPrompt} 
                  onGenerate={handleGenerateCode}
                  isLoading={isLoading}
                />
                {error && (
                  <div className="mt-4 p-4 bg-red-900/30 text-red-300 rounded-md border border-red-700">
                    {error}
                  </div>
                )}
              </div>
              
              <CodeOutput output={generatedCode} />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

export default App; 