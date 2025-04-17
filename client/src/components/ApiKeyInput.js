import React, { useState } from 'react';

function ApiKeyInput({ apiKey, setApiKey, apiUrl, setApiUrl, provider }) {
  const [showKey, setShowKey] = useState(false);

  const getApiKeyPlaceholder = () => {
    switch (provider) {
      case 'openai':
        return 'sk-...';
      case 'anthropic':
        return 'sk-ant-...';
      case 'gemini':
        return 'AIza...';
      case 'cohere':
        return 'co-...';
      case 'ollama':
        return 'Optional API key';
      case 'local':
        return 'API key (if required)';
      default:
        return 'Enter API key';
    }
  };

  const getApiKeyHelp = () => {
    switch (provider) {
      case 'openai':
        return (
          <a 
            href="https://platform.openai.com/api-keys" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary-light hover:text-primary-dark transition-colors"
          >
            Get your OpenAI API key
          </a>
        );
      case 'anthropic':
        return (
          <a 
            href="https://console.anthropic.com/settings/keys" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary-light hover:text-primary-dark transition-colors"
          >
            Get your Anthropic API key
          </a>
        );
      case 'gemini':
        return (
          <a 
            href="https://aistudio.google.com/app/apikey" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary-light hover:text-primary-dark transition-colors"
          >
            Get your Google AI Studio API key
          </a>
        );
      case 'cohere':
        return (
          <a 
            href="https://dashboard.cohere.com/api-keys" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary-light hover:text-primary-dark transition-colors"
          >
            Get your Cohere API key
          </a>
        );
      case 'ollama':
        return (
          <span className="text-gray-400">
            For local Ollama, no API key is needed. For hosted Ollama, enter if required.
          </span>
        );
      case 'local':
        return (
          <span className="text-gray-400">
            Enter the API key for your custom model if required.
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="mb-6">
      <label htmlFor="apiKey" className="block text-sm font-medium text-gray-300 mb-2">
        API Key
      </label>
      <div className="relative">
        <input
          id="apiKey"
          type={showKey ? 'text' : 'password'}
          className="w-full p-3 bg-secondary-dark border border-gray-700 rounded-lg shadow-inner text-gray-100 focus:ring-primary focus:border-primary"
          placeholder={getApiKeyPlaceholder()}
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-primary transition-colors"
          onClick={() => setShowKey(!showKey)}
        >
          {showKey ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
              <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
          )}
        </button>
      </div>
      <p className="mt-2 text-sm text-gray-400">
        Your API key is stored locally and never sent to our servers. {getApiKeyHelp()}
      </p>

      {(provider === 'ollama' || provider === 'local') && (
        <div className="mt-5">
          <label htmlFor="apiUrl" className="block text-sm font-medium text-gray-300 mb-2">
            API URL
          </label>
          <input
            id="apiUrl"
            type="text"
            className="w-full p-3 bg-secondary-dark border border-gray-700 rounded-lg shadow-inner text-gray-100 focus:ring-primary focus:border-primary"
            placeholder={provider === 'ollama' ? 'http://localhost:11434/api' : 'https://your-api-endpoint.com/v1/chat/completions'}
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
          />
          <p className="mt-2 text-sm text-gray-400">
            {provider === 'ollama' 
              ? 'Default for local Ollama is http://localhost:11434/api' 
              : 'Enter the full URL of your custom API endpoint'}
          </p>
        </div>
      )}
    </div>
  );
}

export default ApiKeyInput; 