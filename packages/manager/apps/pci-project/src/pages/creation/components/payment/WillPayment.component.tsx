import React, { lazy, Suspense, useEffect, useRef } from 'react';
import { TWillPaymentConfig } from '@/types/WillPayment.type';
import { setupRegisteredPaymentMethodListener } from '../../utils/paymentEvents';

type WillPaymentModuleProps = {
  slotRef: React.RefObject<HTMLDivElement>;
  config: TWillPaymentConfig;
};

type WillPaymentComponentProps = {
  config: TWillPaymentConfig;
  onRegisteredPaymentMethodSelected: (event: CustomEvent) => void;
};

/**
 * Lazy-loads and mounts the Will Payment federated module.
 * Cleans up on unmount.
 */
const WillPaymentModule = lazy(() =>
  import('willPayment/WillPayment').then((module) => ({
    default: (props: WillPaymentModuleProps) => {
      const setUpWillPayment = module.default;

      useEffect(() => {
        const { slotRef, config } = props;

        if (!slotRef.current) {
          return undefined;
        }

        setUpWillPayment((slotRef.current as unknown) as HTMLSlotElement, {
          configuration: config,
        });

        // Cleanup function to prevent memory leaks
        return () => {
          if (slotRef.current) {
            slotRef.current.innerHTML = '';
          }
        };
      }, [props.slotRef, props.config]);

      return null;
    },
  })),
);

/**
 * WillPaymentComponent
 * @param config - Configuration for the Will Payment module
 */
function WillPaymentComponent({
  config,
  onRegisteredPaymentMethodSelected,
}: Readonly<WillPaymentComponentProps>) {
  const slotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cleanup = setupRegisteredPaymentMethodListener(
      onRegisteredPaymentMethodSelected,
    );

    return cleanup || undefined;
  }, [slotRef, onRegisteredPaymentMethodSelected]);

  return (
    <div id="will-payment-event-bus" ref={slotRef}>
      <Suspense>
        <WillPaymentModule slotRef={slotRef} config={config} />
      </Suspense>
    </div>
  );
}

export default React.memo(WillPaymentComponent);
