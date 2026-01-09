import React, { lazy, useEffect, useRef } from 'react';

import { loadRemote } from '@module-federation/runtime';

import { TWillPaymentConfig } from '@/types/UWillPayment.type';

type WillPaymentModuleProps = {
  slotRef: React.RefObject<HTMLDivElement>;
  config: TWillPaymentConfig | null;
};

type WillPaymentSetupFunction = (
  element: HTMLElement,
  options: { configuration: TWillPaymentConfig },
) => void;

/**
 * Lazy-loaded WillPayment module wrapper
 * Transforms the imperative WillPayment setup function into a React component
 */
export const WillPaymentModule = lazy(() =>
  loadRemote<{ default: WillPaymentSetupFunction }>('willPayment/WillPayment').then((module) => {
    if (!module) {
      throw new Error('Failed to load WillPayment module');
    }

    const setupFunction = module.default || module;

    const WillPaymentWrapper = ({ slotRef, config }: WillPaymentModuleProps) => {
      const hasInitialized = useRef(false);

      useEffect(() => {
        const element = slotRef.current;
        if (!element || !config || hasInitialized.current) {
          return undefined;
        }

        hasInitialized.current = true;

        setupFunction(element, { configuration: config });

        return () => {
          if (element) {
            element.innerHTML = '';
          }
          hasInitialized.current = false;
        };
      }, [slotRef, config]);

      return null;
    };

    return {
      default: WillPaymentWrapper,
    };
  }),
);
