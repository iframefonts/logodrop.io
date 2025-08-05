import React, { useState, useCallback } from 'react';
import { LOGO_STYLES } from '../constants';
import { LogoStyle } from '../types';
import { generateLogo } from '../services/geminiService';
import StyleSelector from './StyleSelector';
import LogoDisplay from './LogoDisplay';
import { SparklesIcon, ExclamationTriangleIcon, DownloadIcon } from './Icons';
import { BuyCredits } from './BuyCredits';

interface LogoGeneratorProps {
  credits: number | null;
  onGenerationSuccess: () => Promise<void>;
}

export function LogoGenerator({ credits, onGenerationSuccess }: LogoGeneratorProps) {
  const [brandName, setBrandName] = useState<string>('Aura');
  const [logoPrompt, setLogoPrompt] = useState<string>('A stylized phoenix rising');
  const [selectedStyle, setSelectedStyle] = useState<LogoStyle>(LOGO_STYLES[0].styles[0]);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [displayedName, setDisplayedName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateClick = useCallback(async () => {
    if (credits === 0) {
      setError("You are out of credits. Please purchase more to continue.");
      return;
    }
    
    if (!logoPrompt || !brandName || !selectedStyle) {
      setError('Please fill out all fields and select a style.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedImage(null);
    setDisplayedName(null);

    try {
      const { imageUrl } = await generateLogo(brandName, logoPrompt, selectedStyle);
      setGeneratedImage(imageUrl);
      setDisplayedName(brandName);
      await onGenerationSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [logoPrompt, brandName, selectedStyle, credits, onGenerationSuccess]);

  const handleDownload = useCallback(() => {
    if (!generatedImage || !displayedName) return;

    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `${displayedName.toLowerCase().replace(/\s+/g, '-')}-logo.jpeg`;
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [generatedImage, displayedName]);

  const canGenerate = !isLoading && !!brandName && !!logoPrompt && credits !== null && credits > 0;

  return (
    <main className="container mx-auto p-4 md:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Left Column: Controls */}
        <div className="flex flex-col gap-6">
          <div>
            <label htmlFor="brandName" className="block text-sm font-medium text-gray-400 mb-2">1. What is your brand name?</label>
            <input
              id="brandName"
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              placeholder="e.g., Aura, Phoenix, Nova"
              className="w-full bg-gray-800 border border-gray-700 rounded-md p-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>
          
          <div>
            <label htmlFor="logoPrompt" className="block text-sm font-medium text-gray-400 mb-2">2. What should your logo look like?</label>
            <input
              id="logoPrompt"
              type="text"
              value={logoPrompt}
              onChange={(e) => setLogoPrompt(e.target.value)}
              placeholder="e.g., a minimal wolf head, a tech startup brain icon"
              className="w-full bg-gray-800 border border-gray-700 rounded-md p-3 text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
            />
          </div>

          <div>
             <label className="block text-sm font-medium text-gray-400 mb-2">3. Choose a style</label>
             <StyleSelector
              categories={LOGO_STYLES}
              selectedStyle={selectedStyle}
              onSelectStyle={setSelectedStyle}
            />
          </div>
          
          <div>
            <button
              onClick={handleGenerateClick}
              disabled={!canGenerate}
              className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-md transition-all duration-300 transform active:scale-95"
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
                <>
                  <SparklesIcon className="h-5 w-5" />
                  Generate Logo (1 Credit)
                </>
              )}
            </button>
            {credits === 0 && <BuyCredits />}
          </div>
        </div>

        {/* Right Column: Display */}
        <div className="flex flex-col">
          <label className="block text-sm font-medium text-gray-400 mb-2">4. Your result</label>
          {error && (
            <div className="bg-red-900/50 border border-red-700 text-red-300 p-4 rounded-md mb-4 flex items-center gap-3">
              <ExclamationTriangleIcon className="h-6 w-6" />
              <div>
                <h3 className="font-bold">Generation Failed</h3>
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}
          <LogoDisplay image={generatedImage} isLoading={isLoading} />
          
          {!isLoading && generatedImage && displayedName && (
            <div className="mt-6 text-center">
              <div className="bg-gray-800/50 p-4 rounded-lg">
                <h2 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-400">{displayedName}</h2>
              </div>
              <div className="mt-4">
                <button
                  onClick={handleDownload}
                  className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-md transition-all duration-300 transform active:scale-95"
                >
                  <DownloadIcon className="h-5 w-5" />
                  Download Logo
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
