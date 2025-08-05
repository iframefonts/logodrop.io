
import React from 'react';
import { PhotoIcon } from './Icons';

interface LogoDisplayProps {
  image: string | null;
  isLoading: boolean;
}

const LogoDisplay: React.FC<LogoDisplayProps> = ({ image, isLoading }) => {
  return (
    <div className="aspect-square w-full bg-gray-800 border-2 border-dashed border-gray-700 rounded-lg flex items-center justify-center p-2 relative overflow-hidden">
      {isLoading && (
        <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center z-10">
          <div className="w-16 h-16 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      {!isLoading && !image && (
        <div className="text-center text-gray-500">
            <PhotoIcon className="mx-auto h-12 w-12 text-gray-600" />
            <p className="mt-2 text-sm">Your generated logo will appear here</p>
        </div>
      )}

      {image && (
        <img
          src={image}
          alt="Generated Logo"
          className="w-full h-full object-contain rounded-md"
        />
      )}
    </div>
  );
};

export default LogoDisplay;
