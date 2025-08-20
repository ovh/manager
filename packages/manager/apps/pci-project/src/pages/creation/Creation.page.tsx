import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { OvhSubsidiary, StepComponent } from '@ovh-ux/manager-react-components';
import { OdsText } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  useAttachConfigurationToCartItem,
  useCreateAndAssignCart,
  useOrderProjectItem,
} from '@/data/hooks/useCart';
import FullPageSpinner from '@/components/FullPageSpinner';
import { useConfigForm } from './hooks/useConfigForm';
import ConfigStep from './steps/ConfigStep';
import PaymentStep from './steps/PaymentStep';
import { useStepper } from './hooks/useStepper';
import { TPaymentMethodRef } from '@/components/payment/PaymentMethods';
import { getCartCheckout } from '@/data/api/cart';
import { useCheckoutCart } from '@/hooks/useCheckout/useCheckout';
import { CartSummary } from '@/data/types/cart.type';

export default function ProjectCreation() {
  const { t } = useTranslation([
    'new/config',
    'new/payment',
    NAMESPACES.ACTIONS,
  ]);

  const navigate = useNavigate();
  const { environment } = useContext(ShellContext);
  const user = environment.getUser();
  const ovhSubsidiary = user.ovhSubsidiary as OvhSubsidiary;

  const { form, setForm, isConfigFormValid } = useConfigForm(ovhSubsidiary);
  const [isPaymentMethodValid, setIsPaymentMethodValid] = useState<boolean>(
    false,
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [customSubmitButton, setCustomSubmitButton] = useState<string | null>(
    null,
  );

  const { mutate: createAndAssignCart, data: cart } = useCreateAndAssignCart();
  const { mutate: orderProjectItem, data: projectItem } = useOrderProjectItem();
  const {
    mutate: attachConfigurationToCartItem,
  } = useAttachConfigurationToCartItem();
  const { mutate: checkoutCart } = useCheckoutCart();

  const {
    currentStep,
    setCurrentStep,
    isConfigChecked,
    isConfigLocked,
    isPaymentOpen,
    isPaymentChecked,
    isPaymentLocked,
  } = useStepper();

  useEffect(() => {
    createAndAssignCart(
      { ovhSubsidiary },
      {
        onSuccess: (createdCart) => {
          orderProjectItem({
            cartId: createdCart.cartId,
          });
        },
      },
    );
  }, [createAndAssignCart, orderProjectItem, ovhSubsidiary]);

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

  const paymentHandlerRef = React.useRef<TPaymentMethodRef>(null);

  const handleCancel = useCallback(() => navigate('..'), [navigate]);
  const handlePaymentNext = useCallback(async () => {
    if (!cart || !paymentHandlerRef.current) {
      return;
    }

    setIsSubmitting(true);
    try {
      if (!(await paymentHandlerRef.current.submitPaymentMethod(cart))) {
        setIsSubmitting(false);
        return;
      }

      const cartCheckoutInfo = await getCartCheckout(cart.cartId);

      if (paymentHandlerRef.current.onCheckoutRetrieved) {
        if (
          !(await paymentHandlerRef.current.onCheckoutRetrieved({
            ...cartCheckoutInfo,
            cartId: cart.cartId,
          }))
        ) {
          setIsSubmitting(false);
          return;
        }
      }

      checkoutCart(
        {
          cartId: cart.cartId,
        },
        {
          onSuccess: async (cartFinalized: CartSummary) => {
            if (
              paymentHandlerRef.current &&
              paymentHandlerRef.current.onCartFinalized
            ) {
              if (
                !(await paymentHandlerRef.current.onCartFinalized({
                  ...cartFinalized,
                  cartId: cart.cartId,
                }))
              ) {
                setIsSubmitting(false);
                return;
              }
            }
            setIsSubmitting(false);
          },
          onError: () => {
            setIsSubmitting(false);
          },
        },
      );
    } catch (error) {
      setIsSubmitting(false);
    }
  }, [paymentHandlerRef, cart, isSubmitting]);

  if (!cart || !projectItem) {
    return <FullPageSpinner />;
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[var(--ods-color-primary-050)]">
      <div className="bg-white min-h-screen w-full max-w-2xl p-10 shadow-lg">
        <OdsText preset={ODS_TEXT_PRESET.heading1}>
          {t('pci_project_new_config_title')}
        </OdsText>

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
            action: handlePaymentNext,
            label:
              customSubmitButton ||
              t('pci_project_new_payment_btn_continue_default', {
                ns: 'new/payment',
              }),
            isDisabled: !isPaymentMethodValid || isSubmitting,
          }}
          skip={{
            action: handleCancel,
            label: t('cancel', { ns: NAMESPACES.ACTIONS }),
          }}
        >
          <PaymentStep
            cart={cart}
            cartProjectItem={projectItem}
            handleIsPaymentMethodValid={(isValid) => {
              setIsPaymentMethodValid(isValid);
            }}
            handleCustomSubmitButton={(btn) => setCustomSubmitButton(btn)}
            paymentHandler={paymentHandlerRef}
          />
        </StepComponent>
      </div>
    </div>
  );
}
