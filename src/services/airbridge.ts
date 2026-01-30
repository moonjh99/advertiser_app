import { Airbridge } from 'airbridge-react-native-sdk';

export const trackEvent = (
  eventName: string,
  props?: Record<string, any>,
) => {
  Airbridge.trackEvent(eventName, props);
};

/** Airbridge에 사용자 ID 등록 (로그인/회원가입 후 호출 권장) */
export const setUserId = (userId: string) => {
  Airbridge.setUserID(userId);
};