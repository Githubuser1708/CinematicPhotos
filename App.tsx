import React, { useState, useEffect } from 'react';
import PreWeddingGen from './components/PreWeddingGen';
import { Camera } from 'lucide-react';

const App: React.FC = () => {
  const [hasApiKey, setHasApiKey] = useState(false);

  useEffect(() => {
    const checkApiKey = async () => {
      if ((window as any).aistudio && (window as any).aistudio.hasSelectedApiKey) {
        const has = await (window as any).aistudio.hasSelectedApiKey();
        setHasApiKey(has);
      } else {
        // Fallback for environments without the wrapper, or assume key is set if wrapper is missing
        setHasApiKey(true);
      }
    };
    checkApiKey();
  }, []);

  const handleSelectKey = async () => {
    if ((window as any).aistudio && (window as any).aistudio.openSelectKey) {
      await (window as any).aistudio.openSelectKey();
      // Assume success after dialog interaction to avoid race conditions
      setHasApiKey(true);
    }
  };

  if (!hasApiKey) {
    return (
      <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="flex justify-center mb-4">
             <div className="bg-amber-600 p-3 rounded-xl shadow-lg shadow-amber-950/40">
                <Camera className="w-8 h-8 text-stone-950" />
             </div>
          </div>
          <h1 className="text-3xl font-serif font-bold bg-gradient-to-r from-rose-500 via-amber-400 via-emerald-400 via-cyan-400 via-blue-500 to-fuchsia-500 bg-clip-text text-transparent">Welcome to Cinematic PhotoCreation</h1>
          <p className="text-stone-400">
            To use our premium photo generation features (powered by Gemini 3 Pro), please select a paid API key from your Google Cloud project.
          </p>
          <button
            onClick={handleSelectKey}
            className="w-full bg-amber-600 hover:bg-amber-500 text-stone-950 font-semibold py-3 px-6 rounded-xl transition-all shadow-lg shadow-amber-950/40"
          >
            Select API Key
          </button>
          <div className="pt-2">
            <a 
              href="https://ai.google.dev/gemini-api/docs/billing" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm text-stone-500 hover:text-amber-400 underline transition-colors"
            >
              Read Billing Documentation
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-stone-900/90 backdrop-blur-md border-b border-stone-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2.5">
              <div className="bg-gradient-to-tr from-amber-600 to-amber-500 p-2 rounded-xl shadow-md shadow-amber-950/40">
                <Camera className="w-5 h-5 text-stone-950" />
              </div>
              <span className="text-xl font-serif font-bold tracking-wide bg-gradient-to-r from-rose-500 via-amber-400 via-emerald-400 via-cyan-400 via-blue-500 to-fuchsia-500 bg-clip-text text-transparent">
                Cinematic PhotoCreation
              </span>
            </div>
            
            {/* Single Page - No Navigation Needed */}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
         <PreWeddingGen />
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-900 py-6 text-center text-stone-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Cinematic PhotoCreation. Powered by Google Gemini.</p>
      </footer>
    </div>
  );
};

export default App;