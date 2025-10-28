import React, { lazy, useEffect } from 'react';
import { loadRemote } from '@module-federation/runtime';
import { TWillPaymentConfig } from '@/types/WillPayment.type';

type WillPaymentModuleProps = {
  slotRef: React.RefObject<HTMLDivElement>;
  config: TWillPaymentConfig;
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
  loadRemote<{ default: WillPaymentSetupFunction }>(
    'willPayment/WillPayment',
  ).then((module) => {
    if (!module) {
      throw new Error('Failed to load WillPayment module');
    }

    const setupFunction = module.default || module;

    return {
      default: ({ slotRef, config }: WillPaymentModuleProps) => {
        useEffect(() => {
          const element = slotRef.current;
          if (!element) {
            return undefined;
          }

          setupFunction(element, { configuration: config });

          return () => {
            if (element) {
              element.innerHTML = '';
            }
          };
        }, [slotRef, config]);

        return null;
      },
    };
  }),
);
