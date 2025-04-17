import React, { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

function CodeOutput({ output }) {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  
  useEffect(() => {
    // Only parse if output exists
    if (output) {
      // Parse the generated code to extract files
      const extractedFiles = parseGeneratedCode(output);
      setFiles(extractedFiles);
      
      if (extractedFiles.length > 0) {
        setSelectedFile(extractedFiles[0]);
      }
    } else {
      setFiles([]);
      setSelectedFile(null);
    }
  }, [output]);
  
  // Function to parse the generated code and extract files
  const parseGeneratedCode = (codeText) => {
    if (!codeText) return [];
    
    const fileRegex = /```(?:(\w+):)?([^\n]+)?\n([\s\S]*?)```/g;
    const files = [];
    let match;
    
    while ((match = fileRegex.exec(codeText)) !== null) {
      const language = match[1] || 'text';
      const filePath = match[2] || `file${files.length + 1}.${getExtensionFromLanguage(language)}`;
      const content = match[3];
      
      files.push({
        id: files.length,
        name: filePath.split('/').pop(),
        path: filePath,
        language,
        content
      });
    }
    
    return files;
  };
  
  // Helper function to get file extension from language
  const getExtensionFromLanguage = (language) => {
    const extensionMap = {
      javascript: 'js',
      typescript: 'ts',
      jsx: 'jsx',
      tsx: 'tsx',
      html: 'html',
      css: 'css',
      python: 'py',
      java: 'java',
      go: 'go',
      rust: 'rs',
      ruby: 'rb',
      php: 'php',
      csharp: 'cs',
      cpp: 'cpp',
      c: 'c'
    };
    
    return extensionMap[language.toLowerCase()] || 'txt';
  };
  
  // Function to download all files as a zip
  const downloadAllFiles = () => {
    // In a real implementation, you would use JSZip or similar library
    alert('Download functionality would be implemented with JSZip in a production app');
  };
  
  // Function to extract code blocks from the output
  const extractCodeBlocks = (text) => {
    // Check if text is undefined or null
    if (!text) return [];
    
    const codeBlockRegex = /```([a-zA-Z0-9_\-\.\/]+)?\n([\s\S]*?)```/g;
    const blocks = [];
    let lastIndex = 0;
    let match;

    while ((match = codeBlockRegex.exec(text)) !== null) {
      // Add text before code block
      if (match.index > lastIndex) {
        blocks.push({
          type: 'text',
          content: text.substring(lastIndex, match.index)
        });
      }

      // Add code block
      const [, path, code] = match;
      blocks.push({
        type: 'code',
        path: path || '',
        content: code
      });

      lastIndex = match.index + match[0].length;
    }

    // Add remaining text
    if (lastIndex < text.length) {
      blocks.push({
        type: 'text',
        content: text.substring(lastIndex)
      });
    }

    return blocks;
  };

  // Function to determine language from file path
  const getLanguageFromPath = (path) => {
    if (!path) return 'javascript';
    
    const extension = path.split('.').pop().toLowerCase();
    const languageMap = {
      js: 'javascript',
      jsx: 'jsx',
      ts: 'typescript',
      tsx: 'tsx',
      py: 'python',
      java: 'java',
      html: 'html',
      css: 'css',
      json: 'json',
      md: 'markdown',
      // Add more mappings as needed
    };

    return languageMap[extension] || 'javascript';
  };

  // Only extract blocks if output exists
  const blocks = output ? extractCodeBlocks(output) : [];

  // If no output, show placeholder
  if (!output) {
    return (
      <div className="bg-secondary-light rounded-lg shadow-xl border border-primary/20 overflow-hidden">
        <div className="flex justify-between items-center p-4 bg-secondary-dark text-gray-100 border-b border-gray-800">
          <h3 className="text-xl font-bold text-primary">Generated Code</h3>
        </div>
        <div className="p-8 text-center text-gray-400">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
          </svg>
          <p className="text-lg">Enter a prompt and click "Generate Code" to see results here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-secondary-light rounded-lg shadow-xl border border-primary/20 overflow-hidden">
      <div className="flex justify-between items-center p-4 bg-secondary-dark text-gray-100 border-b border-gray-800">
        <h3 className="text-xl font-bold text-primary">Generated Code</h3>
        {files.length > 0 && (
          <button 
            onClick={downloadAllFiles}
            className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md font-medium transition-colors duration-300"
          >
            Download All Files
          </button>
        )}
      </div>
      
      {files.length > 0 ? (
        <div className="flex flex-col md:flex-row">
          {/* File list sidebar */}
          <div className="w-full md:w-1/4 border-r border-gray-800">
            <div className="p-4 bg-secondary-dark border-b border-gray-800">
              <h4 className="font-medium text-gray-300">Files</h4>
            </div>
            <ul className="overflow-auto" style={{ maxHeight: '500px' }}>
              {files.map(file => (
                <li 
                  key={file.id}
                  className={`p-3 border-b border-gray-800 cursor-pointer hover:bg-secondary ${selectedFile && selectedFile.id === file.id ? 'bg-primary/10 border-l-4 border-l-primary' : ''}`}
                  onClick={() => setSelectedFile(file)}
                >
                  <div className="font-medium text-gray-200">{file.name}</div>
                  <div className="text-xs text-gray-500">{file.path}</div>
                </li>
              ))}
            </ul>
          </div>
          
          {/* Code viewer */}
          <div className="w-full md:w-3/4">
            {selectedFile && (
              <div>
                <div className="p-4 bg-secondary-dark border-b border-gray-800 flex justify-between items-center">
                  <h4 className="font-medium text-gray-300">{selectedFile.path}</h4>
                  <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">{selectedFile.language}</span>
                </div>
                <div className="overflow-auto" style={{ maxHeight: '500px' }}>
                  <SyntaxHighlighter
                    language={selectedFile.language}
                    style={vscDarkPlus}
                    showLineNumbers
                    wrapLines
                  >
                    {selectedFile.content}
                  </SyntaxHighlighter>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="p-6">
          <div className="mt-6">
            {blocks.map((block, index) => (
              <div key={index} className="mb-6">
                {block.type === 'text' ? (
                  <div className="prose prose-invert max-w-none">
                    {block.content.split('\n').map((line, i) => (
                      <p key={i} className="text-gray-300">{line}</p>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-md overflow-hidden">
                    {block.path && (
                      <div className="bg-secondary-dark text-gray-300 px-4 py-2 text-sm font-mono border-b border-gray-700">
                        {block.path}
                      </div>
                    )}
                    <SyntaxHighlighter
                      language={getLanguageFromPath(block.path)}
                      style={vscDarkPlus}
                      showLineNumbers
                      wrapLines
                      className="text-sm"
                    >
                      {block.content}
                    </SyntaxHighlighter>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default CodeOutput; 