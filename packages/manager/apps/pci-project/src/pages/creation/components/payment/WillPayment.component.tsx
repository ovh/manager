import { Suspense, useContext, useEffect, useRef } from 'react';
import {
  ShellContext,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { OdsSpinner } from '@ovhcloud/ods-components/react';
import { GlobalStateStatus } from '@/types/WillPayment.type';
import { useWillPaymentConfig } from '../../hooks/useWillPaymentConfig';
import { setupWillPaymentEventListeners } from '../../utils/paymentEvents';
import { WillPaymentModule } from './WillPaymentModule';

type WillPaymentComponentProps = {
  onPaymentStatusChange?: (status: GlobalStateStatus) => void;
  onNoUserActionNeeded: (event: CustomEvent) => void;
  onRequiredChallengeEvent: (event: CustomEvent) => void;
};

function WillPaymentComponent({
  onPaymentStatusChange,
  onNoUserActionNeeded,
  onRequiredChallengeEvent,
}: Readonly<WillPaymentComponentProps>) {
  const slotRef = useRef<HTMLDivElement>(null);
  const {
    shell: { navigation },
  } = useContext(ShellContext);

  const { trackClick } = useOvhTracking();

  const config = useWillPaymentConfig({ onPaymentStatusChange });

  const onEditDefaultPaymentMethod = () => {
    trackClick({
      actionType: 'action',
      actions: [
        'project-creation',
        'funnel',
        'external-link',
        'create_project',
        'select_payment',
        'change-default',
      ],
    });
    navigation.navigateTo('dedicated', '#/billing/payment/method', {});
  };

  useEffect(() => {
    const cleanup = setupWillPaymentEventListeners(
      onNoUserActionNeeded,
      onRequiredChallengeEvent,
      onEditDefaultPaymentMethod,
    );
    return cleanup || undefined;
  }, [onNoUserActionNeeded, onRequiredChallengeEvent]);

  return (
    <div id="will-payment-event-bus" ref={slotRef}>
      <Suspense fallback={<OdsSpinner />}>
        <WillPaymentModule slotRef={slotRef} config={config} />
      </Suspense>
    </div>
  );
}

export default WillPaymentComponent;
