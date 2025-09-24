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
  useGetCart,
  useGetOrderProjectId,
  useOrderProjectItem,
} from '@/data/hooks/useCart';
import FullPageSpinner from '@/components/FullPageSpinner';
import { useConfigForm } from './hooks/useConfigForm';
import { useCreation } from './hooks/useCreation';
import { useStepper } from './hooks/useStepper';
import ConfigStep from './steps/ConfigStep';
import PaymentStep from './steps/PaymentStep';
import { useWillPayment } from './hooks/useWillPayment';

export default function ProjectCreation() {
  const { t } = useTranslation([
    'new/config',
    'new/payment',
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
    hasInitialCart ? searchParams.get('cartId') || undefined : undefined,
  );

  const {
    form,
    setForm,
    isConfigFormValid,
    isLoading: isLoadingConfigForm,
  } = useConfigForm(
    ovhSubsidiary,
    hasInitialCart ? searchParams.get('cartId') || undefined : undefined,
  );

  const cart = hasInitialCart ? existingCart : createdCart;

  const {
    mutate: orderProjectItem,
    data: createdProjectItem,
  } = useOrderProjectItem();
  const { data: existingProjectItem } = useGetOrderProjectId(
    hasInitialCart ? searchParams.get('cartId') || undefined : undefined,
  );

  const projectItem = hasInitialCart ? existingProjectItem : createdProjectItem;

  const {
    mutate: attachConfigurationToCartItem,
  } = useAttachConfigurationToCartItem();

  const {
    currentStep,
    setCurrentStep,
    isConfigChecked,
    isConfigLocked,
    isPaymentOpen,
    isPaymentChecked,
    isPaymentLocked,
  } = useStepper();

  const {
    isSubmitting,
    needToCheckCustomerInfo,
    billingHref,
    handleProjectCreation,
  } = useCreation({ t, cart, projectItem });

  const {
    isPaymentMethodSaveRequired,
    isPaymentMethodSaved,
    isSubmittingDisabled,
    hasDefaultPaymentMethod,
    triggerSavePaymentMethod,
    handlePaymentStatusChange,
    handleRegisteredPaymentMethodSelected,
  } = useWillPayment();

  useEffect(() => {
    if (isLoadingConfigForm) {
      return;
    }

    if (!isConfigFormValid()) {
      return;
    }

    // Proceed to the next step
    setCurrentStep(1);
  }, [isLoadingConfigForm]);

  useEffect(() => {
    // If the cartId is in the URL it means the cart has already been created
    if (hasInitialCart) {
      return;
    }

    createAndAssignCart(
      { ovhSubsidiary },
      {
        onSuccess: (justCreatedCart) => {
          orderProjectItem({
            cartId: justCreatedCart.cartId,
          });
          setSearchParams({ cartId: justCreatedCart.cartId });
        },
      },
    );
  }, [createAndAssignCart, orderProjectItem, ovhSubsidiary, hasInitialCart]);

  const handleConfigNext = () => {
    if (!cart || !projectItem) return;

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
        onSuccess: () => setCurrentStep(1),
      },
    );
  };

  const handleCancel = useCallback(() => navigate('..'), [navigate]);

  const handlePaymentSubmit = () => {
    if (isPaymentMethodSaveRequired) {
      triggerSavePaymentMethod();
    } else if (hasDefaultPaymentMethod) {
      handleProjectCreation();
    }
  };

  /**
   * If the payment method is saved, proceed to Creation directly
   */
  useEffect(() => {
    if (isPaymentMethodSaved) {
      handleProjectCreation();
    }
  }, [isPaymentMethodSaved]);

  if (!cart || !projectItem) {
    return <FullPageSpinner />;
  }

  const paymentStepNextButton = needToCheckCustomerInfo ? (
    <OdsLink
      label={t(
        'pci_project_new_payment_check_anti_fraud_case_fraud_manual_review_link',
        {
          ns: 'new/payment',
        },
      )}
      href={billingHref}
      target="_blank"
      rel="noopener noreferrer"
    />
  ) : (
    t('pci_project_new_payment_btn_continue_default', {
      ns: 'new/payment',
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
          order={1}
          isOpen={true}
          isLocked={isConfigLocked}
          isChecked={isConfigChecked}
          title={t('pci_project_new_config_description_label')}
          edit={
            currentStep > 0
              ? {
                  action: () => setCurrentStep(0),
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
          order={2}
          isOpen={isPaymentOpen}
          isLocked={isPaymentLocked}
          isChecked={isPaymentChecked}
          title={t('pci_project_new_payment_description_label', {
            ns: 'new/payment',
          })}
          next={{
            action: handlePaymentSubmit,
            label: paymentStepNextButton,
            isDisabled: isSubmittingDisabled,
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
            onRegisteredPaymentMethodSelected={
              handleRegisteredPaymentMethodSelected
            }
          />
        </StepComponent>
      </div>
    </div>
  );
}
