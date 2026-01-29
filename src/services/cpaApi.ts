import Config from 'react-native-config';

const CPA_API_BASE = Config.CPA_API_BASE || 'https://api.example.com';

export const sendConversion = async (payload: {
  type: 'FIRST_OPEN' | 'SIGN_UP' | 'PURCHASE';
  userId?: string;
  orderId?: string;
  amount?: number;
}) => {
  try {
    const url = `${CPA_API_BASE}/cpa/event`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    // 전송 확인용 로그 (개발 중에만 확인, 필요시 제거)
    if (__DEV__) {
      console.log('[CPA] sendConversion', payload.type, response.ok ? 'OK' : response.status, payload);
    }
  } catch (e) {
    console.error('[CPA] sendConversion error', e);
  }
};
