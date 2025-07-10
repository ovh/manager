import clsx from 'clsx';
import React, { useEffect, useRef } from 'react';
import { PAYPAL_BUTTON_OPTIONS } from '@/constants';
import { PayPalPaymentConfig } from '../types';

interface PayPalButtonProps {
  isSDKReady: boolean;
  config: PayPalPaymentConfig;
  disabled?: boolean;
}

/**
 * Component responsible only for PayPal button rendering
 */
export const PayPalButton: React.FC<PayPalButtonProps> = ({
  isSDKReady,
  config,
  disabled,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function setupPayPalButton() {
      const paypalSdk = ((window as unknown) as Record<string, unknown>)
        .paypal as Record<string, unknown>;
      if (!isSDKReady || !containerRef.current || !paypalSdk?.Button) {
        return;
      }

      // Clean up any existing PayPal button
      containerRef.current.innerHTML = '';

      const finalConfig = {
        ...PAYPAL_BUTTON_OPTIONS,
        ...config,
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (paypalSdk.Button as any).render(finalConfig, containerRef.current);
    }

    setupPayPalButton();

    // Cleanup function
    return () => {
      if (containerRef.current) {
        containerRef.current.innerHTML = '';
      }
    };
  }, [isSDKReady, config]);

  return (
    <div className="paypal-button-wrapper">
      <div
        ref={containerRef}
        className={clsx('paypal-button-container', {
          'opacity-50 cursor-not-allowed pointer-events-none': disabled,
        })}
      />
    </div>
  );
};
