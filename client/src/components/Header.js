import React from 'react';

function Header() {
  return (
    <header className="bg-secondary-dark py-4 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <svg className="h-10 w-10 text-primary" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" />
            </svg>
            <span className="ml-3 text-xl font-bold text-white font-heading">AI Code Generator</span>
          </div>
          <nav className="hidden md:flex space-x-8">
            <a href="#" className="text-gray-300 hover:text-primary transition-colors">Home</a>
            <a href="#" className="text-gray-300 hover:text-primary transition-colors">Features</a>
            <a href="#" className="text-gray-300 hover:text-primary transition-colors">Docs</a>
            <a href="#" className="text-gray-300 hover:text-primary transition-colors">About</a>
          </nav>
          <div className="flex items-center">
            <button className="bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-md font-medium transition-colors duration-300">
              Sign In
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header; 