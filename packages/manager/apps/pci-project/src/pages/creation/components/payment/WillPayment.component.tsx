import { Suspense, useCallback, useContext, useEffect, useRef } from 'react';

import { OdsSpinner } from '@ovhcloud/ods-components/react';

import { ShellContext, useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { GlobalStateStatus } from '@/types/UWillPayment.type';

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

  const onEditDefaultPaymentMethod = useCallback(() => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation]);

  useEffect(() => {
    const cleanup = setupWillPaymentEventListeners(
      onNoUserActionNeeded,
      onRequiredChallengeEvent,
      onEditDefaultPaymentMethod,
    );
    return cleanup || undefined;
  }, [onNoUserActionNeeded, onRequiredChallengeEvent, onEditDefaultPaymentMethod]);

  return (
    <div id="will-payment-event-bus" ref={slotRef}>
      <Suspense fallback={<OdsSpinner />}>
        <WillPaymentModule slotRef={slotRef} config={config} />
      </Suspense>
    </div>
  );
}

export default WillPaymentComponent;
