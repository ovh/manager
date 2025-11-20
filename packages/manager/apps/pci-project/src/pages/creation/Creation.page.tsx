import { useCallback, useContext, useEffect, useState } from 'react';

import { useNavigate, useSearchParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsText } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Notifications, OvhSubsidiary, StepComponent } from '@ovh-ux/manager-react-components';
import { ShellContext, useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import FullPageSpinner from '@/components/full-page-spinner/FullPageSpinner';
import {
  useAttachConfigurationToCartItem,
  useCreateAndAssignCart,
  useDeleteConfigurationItemFromCart,
  useGetCart,
  useOrderProjectItem,
} from '@/data/hooks/useCart';
import { PROJECTS_TRACKING } from '@/tracking.constant';

import CreditConfirmation from './components/credit/CreditConfirmation.component';
import { useConfigForm } from './hooks/useConfigForm';
import { useProjectCreation } from './hooks/useProjectCreation';
import { Step, useStepper } from './hooks/useStepper';
import { useWillPayment } from './hooks/useWillPayment';
import ConfigStepSection from './steps/ConfigStepSection';
import PaymentStepSection from './steps/PaymentStepSection';

export default function ProjectCreation() {
  const { t } = useTranslation(['new/config', 'payment', 'payment/credit', NAMESPACES.ACTIONS]);

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { environment } = useContext(ShellContext);
  const user = environment.getUser();
  const ovhSubsidiary = user.ovhSubsidiary as OvhSubsidiary;
  const [hasInitialCart] = useState<boolean>(!!searchParams.get('cartId'));

  const { trackClick } = useOvhTracking();

  const { mutate: createAndAssignCart, data: createdCart } = useCreateAndAssignCart();

  const { data: existingCart } = useGetCart(searchParams.get('cartId') || undefined);

  const { form, setForm, isConfigFormValid, existingProjectItem, cartConfigurationDescription } =
    useConfigForm(ovhSubsidiary, searchParams.get('cartId') || undefined);

  const { mutate: orderProjectItem, data: createdProjectItem } = useOrderProjectItem();

  const { mutate: attachConfigurationToCartItem } = useAttachConfigurationToCartItem();

  const { mutate: deleteConfigurationItemFromCart } = useDeleteConfigurationItemFromCart();

  const {
    goToConfig,
    goToPayment,
    goToCreditConfirmation,
    isConfigChecked,
    isConfigLocked,
    isPaymentOpen,
    isPaymentChecked,
    isPaymentLocked,
    isCreditConfirmationOpen,
    isCreditConfirmationChecked,
    isCreditConfirmationLocked,
  } = useStepper();

  const cart = hasInitialCart ? existingCart : createdCart;
  const projectItem = hasInitialCart ? existingProjectItem : createdProjectItem;

  const {
    isSubmitting,
    needToCheckCustomerInfo,
    billingHref,
    handleProjectCreation,
    handleCreditAndPay,
    setVoucherCode,
  } = useProjectCreation({ cart, projectItem, goToCreditConfirmation });

  const {
    isCreditPayment,
    creditAmount,
    needsSave,
    isSaved,
    canSubmit,
    hasNoUserActionNeeded,
    savePaymentMethod,
    handlePaymentStatusChange,
    handleNoUserActionNeeded,
    handleChallengeRequired,
  } = useWillPayment();

  useEffect(() => {
    // If the cartId is in the URL it means the cart has already been created
    if (hasInitialCart) {
      goToPayment();
      return;
    }

    createAndAssignCart(
      { ovhSubsidiary },
      {
        onSuccess: ({ cartId }) => {
          orderProjectItem({
            cartId,
          });
        },
      },
    );
  }, [createAndAssignCart, orderProjectItem, ovhSubsidiary, hasInitialCart, goToPayment]);

  const handleConfigNext = () => {
    if (!projectItem) return;

    if (cartConfigurationDescription) {
      deleteConfigurationItemFromCart({
        cartId: projectItem.cartId,
        itemId: projectItem.itemId,
        configurationId: cartConfigurationDescription.id,
      });
    }

    attachConfigurationToCartItem(
      {
        cartId: projectItem.cartId,
        itemId: projectItem.itemId,
        payload: {
          label: 'description',
          value: form.description,
        },
      },
      {
        onSuccess: () => {
          goToPayment();
          setSearchParams({
            ...Object.fromEntries(searchParams.entries()),
            cartId: projectItem.cartId,
          });
        },
      },
    );
  };

  const handlePaymentSubmit = useCallback(() => {
    if (needsSave && !isCreditPayment) {
      // Need to save the payment method first
      savePaymentMethod();
    } else if (hasNoUserActionNeeded || isCreditPayment) {
      void handleProjectCreation({
        isCreditPayment,
        creditAmount: creditAmount?.value ?? 0,
      });
    }
  }, [
    needsSave,
    hasNoUserActionNeeded,
    savePaymentMethod,
    handleProjectCreation,
    isCreditPayment,
    creditAmount,
  ]);

  /**
   * Auto-proceed with project creation when payment method is saved
   */
  useEffect(() => {
    if (isSaved) {
      void handleProjectCreation({});
    }
  }, [isSaved, handleProjectCreation]);

  if (!cart || !projectItem) {
    return <FullPageSpinner />;
  }

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-[var(--ods-color-primary-050)]">
      <div className="min-h-screen w-full max-w-2xl bg-white p-10 shadow-lg">
        <OdsText preset={ODS_TEXT_PRESET.heading1}>{t('pci_project_new_config_title')}</OdsText>

        <div className="my-6 flex flex-col items-stretch gap-4">
          <Notifications />
        </div>

        <ConfigStepSection
          isLocked={isConfigLocked}
          isChecked={isConfigChecked}
          onEdit={goToConfig}
          onNext={handleConfigNext}
          isNextDisabled={!isConfigFormValid()}
          cart={cart}
          projectItem={projectItem}
          ovhSubsidiary={ovhSubsidiary}
          form={form}
          setForm={setForm}
        />

        <PaymentStepSection
          isLocked={isPaymentLocked}
          isChecked={isPaymentChecked}
          isOpen={isPaymentOpen}
          onEdit={goToPayment}
          onNext={handlePaymentSubmit}
          canSubmit={canSubmit}
          isSubmitting={isSubmitting}
          needToCheckCustomerInfo={needToCheckCustomerInfo}
          billingHref={billingHref}
          cart={cart}
          projectItem={projectItem}
          onPaymentStatusChange={handlePaymentStatusChange}
          onNoUserActionNeeded={handleNoUserActionNeeded}
          onChallengeRequired={handleChallengeRequired}
          setVoucherCode={setVoucherCode}
        />

        {isCreditConfirmationOpen && (
          <StepComponent
            order={Step.CreditConfirmation}
            isOpen={isCreditConfirmationOpen}
            isLocked={isCreditConfirmationLocked}
            isChecked={isCreditConfirmationChecked}
            title={t('pci_project_new_payment_credit_confirmation_title', {
              ns: 'payment/credit',
            })}
            next={{
              action: () => {
                trackClick({
                  actionType: 'action',
                  actions: PROJECTS_TRACKING.CREATION.PAYMENT_STEP.CTA_NEXT,
                });
                void handleCreditAndPay();
              },
              label: t('pci_project_new_payment_credit_credit_and_pay', {
                ns: 'payment/credit',
              }),
              isDisabled: isSubmitting,
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
            <CreditConfirmation creditAmount={creditAmount} />
          </StepComponent>
        )}
      </div>
    </div>
  );
}
