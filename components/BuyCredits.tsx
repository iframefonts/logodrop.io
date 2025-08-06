import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { CreditCardIcon } from './Icons';
import { STRIPE_PRODUCTS } from '../stripe-config';

export const BuyCredits: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const creditsProduct = STRIPE_PRODUCTS.find(p => p.name === '50 Logo Credits');

    const handleCheckout = async () => {
        if (!creditsProduct) {
            setError('Product not found');
            return;
        }

        setLoading(true);
        setError(null);
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                throw new Error('Not authenticated');
            }

            const { data, error } = await supabase.functions.invoke('stripe-checkout', {
                body: {
                    price_id: creditsProduct.priceId,
                    mode: creditsProduct.mode,
                    success_url: `${window.location.origin}?checkout_status=success`,
                    cancel_url: window.location.origin
                },
                headers: {
                    Authorization: `Bearer ${session.access_token}`
                }
            });
            
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
                        Buy 50 Credits for €{creditsProduct?.price || 5}
                    </>
                )}
            </button>
            {error && <p className="text-red-400 mt-2 text-sm">{error}</p>}
        </div>
    );
};
