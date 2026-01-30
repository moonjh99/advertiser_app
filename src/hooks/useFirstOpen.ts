import { useEffect } from 'react';
import { trackEvent } from '../services/airbridge';
import { sendConversion } from '../services/cpaApi';

export const useFirstOpen = () => {
  useEffect(() => {
    trackEvent('first_open', {});

    sendConversion({
      type: 'FIRST_OPEN',
    });
  }, []);
}