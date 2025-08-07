import React from 'react';
import { LogoIcon, CreditIcon } from './Icons';
import { supabase } from '../lib/supabaseClient';
import { Session } from '@supabase/supabase-js';

interface HeaderProps {
    session: Session;
    credits: number | null;
}

const Header: React.FC<HeaderProps> = ({ session, credits }) => {
  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <header className="py-4 px-4 md:px-8 border-b border-gray-800">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-400">
            logodrop.io
            </h1>
        </div>
        <div className="flex items-center gap-4">
            {credits !== null && (
                <div className="flex items-center gap-2 bg-gray-800 px-3 py-1.5 rounded-md">
                    <CreditIcon className="h-5 w-5 text-yellow-400" />
                    <span className="text-white font-medium text-sm">{credits} Credits</span>
                </div>
            )}
            <span className="text-gray-400 text-sm hidden md:block">{session.user.email}</span>
            <button
                onClick={handleSignOut}
                className="bg-gray-700 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 text-sm"
            >
                Sign Out
            </button>
        </div>
      </div>
    </header>
  );
};

export default Header;