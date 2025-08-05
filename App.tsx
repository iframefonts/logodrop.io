
import React, { useState, useEffect } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from './lib/supabaseClient';
import AuthComponent from './components/Auth';
import { LogoGenerator } from './components/LogoGenerator';
import Header from './components/Header';

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [credits, setCredits] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchCredits = async (currentSession: Session) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('credits')
        .eq('id', currentSession.user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error.message);
      }
      setCredits(data?.credits ?? null);
    } catch (e) {
      console.error("An unexpected error occurred fetching profile:", e);
      setCredits(null);
    }
  };
  
  useEffect(() => {
    setLoading(true);
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      if (session) {
        await fetchCredits(session);
      } else {
        setCredits(null);
      }
      setLoading(false);
    });
    
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('checkout_status') === 'success') {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                fetchCredits(session);
            }
        });
        window.history.replaceState({}, document.title, window.location.pathname);
    }

    const handleFocus = () => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                fetchCredits(session);
            }
        });
    };
    
    window.addEventListener('focus', handleFocus);

    return () => {
      subscription.unsubscribe();
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const handleSuccessfulGeneration = async () => {
    if (!session) return;
    try {
      const { data, error } = await supabase.rpc('decrement_credits', {
        user_id: session.user.id,
      });

      if (error) {
        throw new Error(`Failed to decrement credits: ${error.message}`);
      }
      if (typeof data === 'number') {
        setCredits(data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return null;
  }

  if (!session) {
    return <AuthComponent />;
  } else {
    return (
      <div className="min-h-screen bg-gray-900 text-gray-100 font-sans">
        <Header session={session} credits={credits} />
        <LogoGenerator 
            key={session.user.id} 
            credits={credits} 
            onGenerationSuccess={handleSuccessfulGeneration} 
        />
        <footer className="text-center p-4 text-gray-500 text-sm">
            <p>Powered by Gemini. Secured by Supabase.</p>
        </footer>
      </div>
    );
  }
}
