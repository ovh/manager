import { OdsSpinner } from '@ovhcloud/ods-components/react';
import { lazy, Suspense, useRef, useEffect } from 'react';
import { TWillPaymentConfig } from '@/types/WillPayment.type';

/**
 * Props for the WillPaymentModule component
 */
interface WillPaymentModuleProps {
  slotRef: React.RefObject<HTMLDivElement>;
  config: TWillPaymentConfig;
}

/**
 * Props for the WillPaymentComponent
 */
interface WillPaymentComponentProps {
  config: TWillPaymentConfig;
}

/**
 * Lazy-loaded Will Payment module component
 *
 * This component handles the dynamic import and initialization of the Will Payment federated module.
 * It manages the module lifecycle including setup and cleanup to prevent duplication.
 */
const WillPaymentModule = lazy(() =>
  import('willPayment/WillPayment').then((module) => ({
    default: (props: WillPaymentModuleProps) => {
      const setUpWillPayment = module.default;

      useEffect(() => {
        const { slotRef, config } = props;

        if (!slotRef.current) {
          return;
        }

        // Clear existing content to prevent duplication
        slotRef.current.innerHTML = '';

        // Initialize the payment module with configuration
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
 *
 * Integrates the Will Payment federated module into the page.
 * Loads the module dynamically and renders it inside a div using a ref.
 * Handles module initialization and cleanup.
 *
 * @param config - Configuration for the Will Payment module
 */
export default function WillPaymentComponent({
  config,
}: WillPaymentComponentProps) {
  const slotRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={slotRef}>
      <Suspense fallback={<OdsSpinner />}>
        <WillPaymentModule slotRef={slotRef} config={config} />
      </Suspense>
    </div>
  );
}
