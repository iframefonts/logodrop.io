import React from 'react';
import { LogoIcon } from './Icons';

interface SuccessPageProps {
  onContinue: () => void;
}

const SuccessPage: React.FC<SuccessPageProps> = ({ onContinue }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-lg shadow-lg border border-gray-700 text-center">
        <div className="space-y-4">
          <div className="mx-auto w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <LogoIcon className="mx-auto h-12 w-12 text-indigo-400" />
          
          <h1 className="text-3xl font-bold text-white">
            Payment Successful!
          </h1>
          
          <p className="text-gray-400">
            Your credits have been added to your account. You can now continue generating amazing logos.
          </p>
        </div>

        <button
          onClick={onContinue}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-md transition-colors duration-200"
        >
          Continue to Logo Generator
        </button>
      </div>
    </div>
  );
};

export default SuccessPage;