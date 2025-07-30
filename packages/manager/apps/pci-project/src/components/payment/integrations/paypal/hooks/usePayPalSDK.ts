import { useCallback, useEffect, useState } from 'react';
import { PAYPAL_SCRIPT } from '@/constants';

interface UsePayPalSDKReturn {
  scriptLoaded: boolean;
  reload: () => void;
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
    if (window.paypal) {
      setScriptLoaded(true);
      return;
    }

    // Check if script already exists
    const existingScript = document.getElementById(PAYPAL_SCRIPT.id);
    if (existingScript) {
      return; // Script is loading, wait for it
    }

    // Create PayPal script
    const script = document.createElement('script');
    script.id = PAYPAL_SCRIPT.id;
    script.src = PAYPAL_SCRIPT.src;
    script.async = true;

    script.onload = () => {
      if (window.paypal) {
        setScriptLoaded(true);
      }
    };

    document.head.appendChild(script);
  }, []);

  const reload = useCallback(() => {
    const existingScript = document.getElementById(PAYPAL_SCRIPT.id);
    if (existingScript) {
      existingScript.remove();
    }
    loadSDK();
  }, [loadSDK]);

  useEffect(() => {
    loadSDK();
  }, [loadSDK]);

  return {
    scriptLoaded,
    reload,
  };
};
