import { Airbridge } from 'airbridge-react-native-sdk';

export const trackEvent = (
  category: string,
  action: string,
  value?: number,
) => {
  Airbridge.trackEvent(
    category,
    { action },
    value !== undefined ? { value } : undefined,
  );
};
