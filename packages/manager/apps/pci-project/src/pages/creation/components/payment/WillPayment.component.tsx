import { Suspense, useEffect, useRef } from 'react';
import { OdsSpinner } from '@ovhcloud/ods-components/react';
import { GlobalStateStatus } from '@/types/WillPayment.type';
import { useWillPaymentConfig } from '../../hooks/useWillPaymentConfig';
import { setupRegisteredPaymentMethodListener } from '../../utils/paymentEvents';
import { WillPaymentModule } from './WillPaymentModule';

type WillPaymentComponentProps = {
  onPaymentStatusChange?: (status: GlobalStateStatus) => void;
  onRegisteredPaymentMethodSelected: (event: CustomEvent) => void;
  onRequiredChallengeEvent: (event: CustomEvent) => void;
};

function WillPaymentComponent({
  onPaymentStatusChange,
  onRegisteredPaymentMethodSelected,
  onRequiredChallengeEvent,
}: Readonly<WillPaymentComponentProps>) {
  const slotRef = useRef<HTMLDivElement>(null);

  const config = useWillPaymentConfig({ onPaymentStatusChange });

  useEffect(() => {
    const cleanup = setupRegisteredPaymentMethodListener(
      onRegisteredPaymentMethodSelected,
      onRequiredChallengeEvent,
    );
    return cleanup || undefined;
  }, [onRegisteredPaymentMethodSelected, onRequiredChallengeEvent]);

  return (
    <div id="will-payment-event-bus" ref={slotRef}>
      <Suspense fallback={<OdsSpinner />}>
        <WillPaymentModule slotRef={slotRef} config={config} />
      </Suspense>
    </div>
  );
}

export default WillPaymentComponent;
