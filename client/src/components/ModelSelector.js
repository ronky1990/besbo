import React from 'react';

function ModelSelector({ selectedProvider, setSelectedProvider, selectedModel, setSelectedModel }) {
  const providers = [
    { id: 'openai', name: 'OpenAI' },
    { id: 'anthropic', name: 'Anthropic' },
    { id: 'gemini', name: 'Google Gemini' },
    { id: 'cohere', name: 'Cohere' },
    { id: 'ollama', name: 'Ollama' },
    { id: 'local', name: 'Custom API' }
  ];

  const models = {
    openai: [
      { id: 'gpt-4o', name: 'GPT-4o' },
      { id: 'gpt-4-turbo', name: 'GPT-4 Turbo' },
      { id: 'gpt-4', name: 'GPT-4' },
      { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' }
    ],
    anthropic: [
      { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus' },
      { id: 'claude-3-7-sonnet-20250219', name: 'Claude 3 Sonnet' },
      { id: 'claude-3-haiku-20240307', name: 'Claude 3 Haiku' },
      { id: 'claude-2.1', name: 'Claude 2.1' },
      { id: 'claude-2.0', name: 'Claude 2.0' },
      { id: 'claude-instant-1.2', name: 'Claude Instant 1.2' }
    ],
    gemini: [
      { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro' },
      { id: 'gemini-1.5-flash', name: 'Gemini 1.5 Flash' },
      { id: 'gemini-1.0-pro', name: 'Gemini 1.0 Pro' }
    ],
    cohere: [
      { id: 'command-r-plus', name: 'Command R+' },
      { id: 'command-r', name: 'Command R' },
      { id: 'command', name: 'Command' }
    ],
    ollama: [
      { id: 'llama3', name: 'Llama 3' },
      { id: 'mistral', name: 'Mistral' },
      { id: 'codellama', name: 'Code Llama' },
      { id: 'llava', name: 'LLaVA' },
      { id: 'custom', name: 'Custom Model' }
    ],
    local: [
      { id: 'custom-api', name: 'Custom API Endpoint' }
    ]
  };

  const handleProviderChange = (e) => {
    const newProvider = e.target.value;
    setSelectedProvider(newProvider);
    setSelectedModel(models[newProvider][0].id);
  };

  return (
    <div className="mb-8">
      <div className="mb-5">
        <label htmlFor="provider" className="block text-sm font-medium text-gray-300 mb-2">
          AI Provider
        </label>
        <select
          id="provider"
          className="w-full p-3 bg-secondary-dark border border-gray-700 rounded-lg shadow-inner text-gray-100 focus:ring-primary focus:border-primary"
          value={selectedProvider}
          onChange={handleProviderChange}
        >
          {providers.map((provider) => (
            <option key={provider.id} value={provider.id}>
              {provider.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="model" className="block text-sm font-medium text-gray-300 mb-2">
          AI Model
        </label>
        <select
          id="model"
          className="w-full p-3 bg-secondary-dark border border-gray-700 rounded-lg shadow-inner text-gray-100 focus:ring-primary focus:border-primary"
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
        >
          {models[selectedProvider].map((model) => (
            <option key={model.id} value={model.id}>
              {model.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

export default ModelSelector; 