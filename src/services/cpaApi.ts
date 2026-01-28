import Config from 'react-native-config';

const CPA_API_BASE = Config.CPA_API_BASE || 'https://api.example.com';

export const sendConversion = async (payload: {
  type: 'FIRST_OPEN' | 'SIGN_UP' | 'PURCHASE';
  userId?: string;
  orderId?: string;
  amount?: number;
}) => {
  try {
    await fetch(`${CPA_API_BASE}/cpa/event`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch (e) {
    console.error('[CPA] sendConversion error', e);
  }
};
