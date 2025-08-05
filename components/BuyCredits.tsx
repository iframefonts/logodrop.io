import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { CreditCardIcon } from './Icons';

export const BuyCredits: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleCheckout = async () => {
        setLoading(true);
        setError(null);
        try {
            // This invokes the 'create-checkout-session' Edge Function
            const { data, error } = await supabase.functions.invoke('create-checkout-session');
            
            if (error) throw error;

            if (data.url) {
                window.location.href = data.url;
            } else {
                throw new Error("Could not retrieve the checkout URL.");
            }
        } catch (e: any) {
            console.error("Checkout error:", e);
            setError(e.message || "Failed to start checkout. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="mt-4 text-center p-4 bg-gray-800 border border-indigo-500 rounded-lg shadow-lg">
            <h3 className="text-lg font-bold text-white">You're Out of Credits!</h3>
            <p className="text-gray-400 mt-1 mb-4">Purchase more to continue creating amazing logos.</p>
            <button
                onClick={handleCheckout}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white font-bold py-3 px-4 rounded-md transition-all duration-300 transform active:scale-95"
            >
                {loading ? (
                    'Redirecting to payment...'
                ) : (
                    <>
                        <CreditCardIcon className="h-5 w-5" />
                        Buy 50 Credits for $5
                    </>
                )}
            </button>
            {error && <p className="text-red-400 mt-2 text-sm">{error}</p>}
        </div>
    );
};
