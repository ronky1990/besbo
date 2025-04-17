import React from 'react';

function PromptInput({ prompt, setPrompt, onGenerate, isLoading }) {
  return (
    <div>
      <textarea
        className="w-full p-4 bg-secondary-dark text-gray-100 border border-gray-700 rounded-lg shadow-inner focus:ring-primary focus:border-primary resize-none"
        rows="6"
        placeholder="Describe the application you want to generate..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      ></textarea>
      
      <div className="mt-4 flex justify-end">
        <button
          className="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-medium rounded-lg shadow-lg transition-colors duration-300 flex items-center"
          onClick={onGenerate}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Generating...
            </>
          ) : (
            'Generate Code'
          )}
        </button>
      </div>
    </div>
  );
}

export default PromptInput; 