import React from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '../lib/supabaseClient';
import { LogoIcon } from './Icons';

const AuthComponent: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-lg shadow-lg border border-gray-700">
        <div className="text-center space-y-3">
            <LogoIcon className="mx-auto h-12 w-12 text-indigo-400" />
            <h1 className="text-3xl md:text-4xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-400">
              Welcome to logodrop.io
            </h1>
            <p className="text-gray-400">Sign in or create an account to start generating logos.</p>
        </div>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={['google']}
          theme="dark"
          socialLayout="horizontal"
        />
      </div>
    </div>
  );
};

export default AuthComponent;