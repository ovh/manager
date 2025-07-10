import { useCallback, useEffect, useState } from 'react';
import { PAYPAL_SCRIPT } from '@/constants';

interface UsePayPalSDKReturn {
  scriptLoaded: boolean;
}

/**
 * Simple hook to manage PayPal SDK loading
 * Only tracks if script is loaded and ready to use
 */
export const usePayPalSDK = (): UsePayPalSDKReturn => {
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const loadSDK = useCallback(() => {
    // Reset state
    setScriptLoaded(false);

    // Check if PayPal is already available
    if (((window as unknown) as Record<string, unknown>).paypal) {
      setScriptLoaded(true);
      return;
    }

    // Create PayPal script
    const script = document.createElement('script');
    script.id = PAYPAL_SCRIPT.id;
    script.src = PAYPAL_SCRIPT.src;
    script.async = true;

    script.onload = () => {
      if (((window as unknown) as Record<string, unknown>).paypal) {
        setScriptLoaded(true);
      }
    };

    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    loadSDK();
  }, [loadSDK]);

  return {
    scriptLoaded,
  };
};
