import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { OdsLink } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { StepComponent } from '@ovh-ux/manager-react-components';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { Cart, OrderedProduct } from '@/data/models/Cart.type';
import { PROJECTS_TRACKING } from '@/tracking.constant';
import { GlobalStateStatus } from '@/types/UWillPayment.type';

import { Step } from '../hooks/useStepper';
import PaymentStep from './PaymentStep';

type Props = {
  isLocked: boolean;
  isChecked: boolean;
  isOpen: boolean;
  onEdit: () => void;
  onNext: () => void;
  canSubmit: boolean;
  isSubmitting: boolean;
  needToCheckCustomerInfo: boolean;
  billingHref: string;
  cart: Cart;
  projectItem: OrderedProduct;
  onPaymentStatusChange: (status: GlobalStateStatus) => void;
  onNoUserActionNeeded: (event: CustomEvent) => void;
  onChallengeRequired: (event: CustomEvent) => void;
  setVoucherCode: (code: string | null) => void;
};

export default function PaymentStepSection({
  isLocked,
  isChecked,
  isOpen,
  onEdit,
  onNext,
  canSubmit,
  isSubmitting,
  needToCheckCustomerInfo,
  billingHref,
  cart,
  projectItem,
  onPaymentStatusChange,
  onNoUserActionNeeded,
  onChallengeRequired,
  setVoucherCode,
}: Readonly<Props>) {
  const { t } = useTranslation(['payment', NAMESPACES.ACTIONS]);
  const navigate = useNavigate();
  const { trackClick } = useOvhTracking();

  const paymentStepNextButton = needToCheckCustomerInfo ? (
    <OdsLink
      label={t('pci_project_new_payment_check_anti_fraud_case_fraud_manual_review_link', {
        ns: 'payment',
      })}
      href={billingHref}
      target="_blank"
      rel="noopener noreferrer"
    />
  ) : (
    t('pci_project_new_payment_btn_continue_default', {
      ns: 'payment',
    })
  );

  return (
    <StepComponent
      order={Step.Payment}
      isOpen={isOpen}
      isLocked={isLocked}
      isChecked={isChecked}
      title={t('pci_project_new_payment_description_label', {
        ns: 'payment',
      })}
      edit={
        isChecked
          ? {
              action: onEdit,
              label: t('modify', { ns: NAMESPACES.ACTIONS }),
              isDisabled: false,
            }
          : undefined
      }
      next={{
        action: () => {
          trackClick({
            actionType: 'action',
            actions: PROJECTS_TRACKING.CREATION.PAYMENT_STEP.CTA_NEXT,
          });
          onNext();
        },
        label: paymentStepNextButton,
        isDisabled: !canSubmit,
        isLoading: isSubmitting,
      }}
      skip={{
        action: () => {
          trackClick({
            actionType: 'action',
            actions: PROJECTS_TRACKING.CREATION.PAYMENT_STEP.CTA_BACK,
          });
          navigate('..');
        },
        label: t('cancel', { ns: NAMESPACES.ACTIONS }),
      }}
    >
      <PaymentStep
        cart={cart}
        cartProjectItem={projectItem}
        onPaymentStatusChange={onPaymentStatusChange}
        onNoUserActionNeeded={onNoUserActionNeeded}
        onRequiredChallengeEvent={onChallengeRequired}
        onVoucherChange={setVoucherCode}
      />
    </StepComponent>
  );
}
