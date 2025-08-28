import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
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
    if (!isSDKReady || !containerRef.current || !window.paypal?.Button) {
      return;
    }

    // Clean up any existing PayPal button
    containerRef.current.innerHTML = '';

    const finalConfig = {
      ...PAYPAL_BUTTON_OPTIONS,
      ...config,
    };

    window.paypal.Button.render(finalConfig, containerRef.current);

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
