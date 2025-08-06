export interface StripeProduct {
  id: string;
  priceId: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  mode: 'payment' | 'subscription';
}

export const STRIPE_PRODUCTS: StripeProduct[] = [
  {
    id: 'prod_SoK7pzibgfQJYX',
    priceId: 'price_1RshTbAF5erC52b9ajjtOEYZ',
    name: '50 Logo Credits',
    description: 'Get 50 credits to generate professional logos with AI',
    price: 5.00,
    currency: 'EUR',
    mode: 'payment'
  }
];

export const getProductByPriceId = (priceId: string): StripeProduct | undefined => {
  return STRIPE_PRODUCTS.find(product => product.priceId === priceId);
};

export const getProductById = (id: string): StripeProduct | undefined => {
  return STRIPE_PRODUCTS.find(product => product.id === id);
};