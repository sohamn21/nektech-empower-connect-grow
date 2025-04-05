
// NOWPayments API utility functions
const NOWPAYMENTS_API_KEY = 'E7TJKQ0-9TJM2MH-GGVGV8J-RM7KRPZ';
const NOWPAYMENTS_API_URL = 'https://api.nowpayments.io/v1';

export interface CreatePaymentResponse {
  payment_id: string;
  payment_status: string;
  pay_address: string;
  price_amount: number;
  price_currency: string;
  pay_amount: number;
  pay_currency: string;
  order_id?: string;
  order_description?: string;
  ipn_callback_url?: string;
  created_at?: string;
  updated_at?: string;
  purchase_id?: string;
  payment_extra_id?: string;
}

/**
 * Create a cryptocurrency payment request
 */
export const createCryptoPayment = async (
  priceAmount: number, 
  orderId: string, 
  orderDescription: string,
  currency = 'inr', // Default to INR
  cryptoCurrency = 'btc' // Default to Bitcoin
): Promise<CreatePaymentResponse> => {
  try {
    const response = await fetch(`${NOWPAYMENTS_API_URL}/payment`, {
      method: 'POST',
      headers: {
        'x-api-key': NOWPAYMENTS_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        price_amount: priceAmount,
        price_currency: currency,
        pay_currency: cryptoCurrency,
        order_id: orderId,
        order_description: orderDescription,
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create payment');
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating NOWPayments payment:', error);
    throw error;
  }
};

/**
 * Get payment status by ID
 */
export const getPaymentStatus = async (paymentId: string): Promise<any> => {
  try {
    const response = await fetch(`${NOWPAYMENTS_API_URL}/payment/${paymentId}`, {
      method: 'GET',
      headers: {
        'x-api-key': NOWPAYMENTS_API_KEY,
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to get payment status');
    }

    return await response.json();
  } catch (error) {
    console.error('Error getting payment status:', error);
    throw error;
  }
};

/**
 * Get available cryptocurrencies
 */
export const getAvailableCurrencies = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${NOWPAYMENTS_API_URL}/currencies`, {
      method: 'GET',
      headers: {
        'x-api-key': NOWPAYMENTS_API_KEY,
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to get currencies');
    }

    const data = await response.json();
    return data.currencies || [];
  } catch (error) {
    console.error('Error getting available currencies:', error);
    return ['btc', 'eth', 'ltc', 'xrp', 'doge']; // Fallback to common cryptocurrencies
  }
};
