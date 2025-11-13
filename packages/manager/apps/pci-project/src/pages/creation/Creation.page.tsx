import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  Notifications,
  OvhSubsidiary,
  StepComponent,
} from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsLink, OdsText } from '@ovhcloud/ods-components/react';
import { useCallback, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  useAttachConfigurationToCartItem,
  useCreateAndAssignCart,
  useDeleteConfigurationItemFromCart,
  useGetCart,
  useOrderProjectItem,
} from '@/data/hooks/useCart';
import FullPageSpinner from '@/components/full-page-spinner/FullPageSpinner';
import CreditConfirmation from './components/credit/CreditConfirmation.component';
import { useConfigForm } from './hooks/useConfigForm';
import { useProjectCreation } from './hooks/useProjectCreation';
import { Step, useStepper } from './hooks/useStepper';
import { useWillPayment } from './hooks/useWillPayment';
import ConfigStep from './steps/ConfigStep';
import PaymentStep from './steps/PaymentStep';

export default function ProjectCreation() {
  const { t } = useTranslation([
    'new/config',
    'payment',
    'payment/credit',
    NAMESPACES.ACTIONS,
  ]);

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { environment } = useContext(ShellContext);
  const user = environment.getUser();
  const ovhSubsidiary = user.ovhSubsidiary as OvhSubsidiary;
  const [hasInitialCart] = useState<boolean>(!!searchParams.get('cartId'));

  const {
    mutate: createAndAssignCart,
    data: createdCart,
  } = useCreateAndAssignCart();

  const { data: existingCart } = useGetCart(
    searchParams.get('cartId') || undefined,
  );

  const {
    form,
    setForm,
    isConfigFormValid,
    existingProjectItem,
    cartConfigurationDescription,
  } = useConfigForm(ovhSubsidiary, searchParams.get('cartId') || undefined);

  const {
    mutate: orderProjectItem,
    data: createdProjectItem,
  } = useOrderProjectItem();

  const {
    mutate: attachConfigurationToCartItem,
  } = useAttachConfigurationToCartItem();

  const {
    mutate: deleteConfigurationItemFromCart,
  } = useDeleteConfigurationItemFromCart();

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
  }, [createAndAssignCart, orderProjectItem, ovhSubsidiary, hasInitialCart]);

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

  const handleCancel = useCallback(() => navigate('..'), [navigate]);

  const handlePaymentSubmit = useCallback(() => {
    if (needsSave && !isCreditPayment) {
      // Need to save the payment method first
      savePaymentMethod();
    } else if (hasNoUserActionNeeded || isCreditPayment) {
      handleProjectCreation({
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
      handleProjectCreation({});
    }
  }, [isSaved]);

  if (!cart || !projectItem) {
    return <FullPageSpinner />;
  }

  const paymentStepNextButton = needToCheckCustomerInfo ? (
    <OdsLink
      label={t(
        'pci_project_new_payment_check_anti_fraud_case_fraud_manual_review_link',
        {
          ns: 'payment',
        },
      )}
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
    <div className="min-h-screen w-full flex items-center justify-center bg-[var(--ods-color-primary-050)]">
      <div className="bg-white min-h-screen w-full max-w-2xl p-10 shadow-lg">
        <OdsText preset={ODS_TEXT_PRESET.heading1}>
          {t('pci_project_new_config_title')}
        </OdsText>

        <div className="mb-6 mt-6 flex flex-col items-stretch gap-4">
          <Notifications />
        </div>

        <StepComponent
          order={Step.Config}
          isOpen={true}
          isLocked={isConfigLocked}
          isChecked={isConfigChecked}
          title={t('pci_project_new_config_description_label')}
          edit={
            isConfigLocked
              ? {
                  action: () => goToConfig(),
                  label: t('modify', { ns: NAMESPACES.ACTIONS }),
                  isDisabled: false,
                }
              : undefined
          }
          next={{
            action: handleConfigNext,
            label: t('next', { ns: NAMESPACES.ACTIONS }),
            isDisabled: !isConfigFormValid(),
          }}
          skip={{
            action: handleCancel,
            label: t('cancel', { ns: NAMESPACES.ACTIONS }),
          }}
        >
          <ConfigStep
            cart={cart}
            cartProjectItem={projectItem}
            ovhSubsidiary={ovhSubsidiary}
            form={form}
            setForm={setForm}
          />
        </StepComponent>

        <StepComponent
          order={Step.Payment}
          isOpen={isPaymentOpen}
          isLocked={isPaymentLocked}
          isChecked={isPaymentChecked}
          title={t('pci_project_new_payment_description_label', {
            ns: 'payment',
          })}
          edit={
            isPaymentChecked
              ? {
                  action: () => goToPayment(),
                  label: t('modify', { ns: NAMESPACES.ACTIONS }),
                  isDisabled: false,
                }
              : undefined
          }
          next={{
            action: handlePaymentSubmit,
            label: paymentStepNextButton,
            isDisabled: !canSubmit,
            isLoading: isSubmitting,
          }}
          skip={{
            action: handleCancel,
            label: t('cancel', { ns: NAMESPACES.ACTIONS }),
          }}
        >
          <PaymentStep
            cart={cart}
            cartProjectItem={projectItem}
            onPaymentStatusChange={handlePaymentStatusChange}
            onNoUserActionNeeded={handleNoUserActionNeeded}
            onRequiredChallengeEvent={handleChallengeRequired}
            onVoucherChange={setVoucherCode}
          />
        </StepComponent>

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
              action: handleCreditAndPay,
              label: t('pci_project_new_payment_credit_credit_and_pay', {
                ns: 'payment/credit',
              }),
              isDisabled: isSubmitting,
              isLoading: isSubmitting,
            }}
            skip={{
              action: handleCancel,
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
