import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  OvhSubsidiary,
  StepComponent,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import { OdsText } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import React, { useCallback, useContext, useEffect, useState } from 'react';
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
import ConfigStep from './steps/ConfigStep';
import PaymentStep from './steps/PaymentStep';
import { useStepper } from './hooks/useStepper';
import { TPaymentMethodRef } from '@/components/payment/PaymentMethods';
import { getCartCheckout } from '@/data/api/cart';
import { useCheckoutCart } from '@/hooks/useCheckout/useCheckout';
import { CartSummary } from '@/data/types/cart.type';
import { usePaymentRedirect } from '@/hooks/payment/usePaymentRedirect';

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

  const [isPaymentMethodValid, setIsPaymentMethodValid] = useState<boolean>(
    false,
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [customSubmitButton, setCustomSubmitButton] = useState<
    string | JSX.Element | null
  >(null);
  const { addError } = useNotifications();

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

  const paymentHandlerRef = React.useRef<TPaymentMethodRef>(null);

  const handleCancel = useCallback(() => navigate('..'), [navigate]);

  const handlePaymentSubmit = useCallback(
    async ({
      paymentMethodId,
      skipRegistration,
    }: {
      paymentMethodId?: number;
      skipRegistration?: boolean;
    }) => {
      if (!cart || !paymentHandlerRef.current) {
        return false;
      }

      setIsSubmitting(true);
      try {
        let currentPaymentMethodId: number | undefined = paymentMethodId;

        if (!skipRegistration) {
          const resultRegister = await paymentHandlerRef.current.submitPaymentMethod(
            cart,
          );

          if (resultRegister.paymentMethod?.paymentMethodId) {
            currentPaymentMethodId =
              resultRegister.paymentMethod?.paymentMethodId;
          }

          if (!resultRegister.continueProcessing) {
            setIsSubmitting(false);
            return resultRegister.dataToReturn;
          }
        }

        const cartCheckoutInfo = await getCartCheckout(cart.cartId);

        if (paymentHandlerRef.current.onCheckoutRetrieved) {
          const resultCheckout = await paymentHandlerRef.current.onCheckoutRetrieved(
            {
              ...cartCheckoutInfo,
              cartId: cart.cartId,
            },
            currentPaymentMethodId,
          );

          if (!resultCheckout.continueProcessing) {
            setIsSubmitting(false);
            return resultCheckout.dataToReturn;
          }
        }

        return new Promise((resolve, reject) => {
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
                  const resultFinalize = await paymentHandlerRef.current.onCartFinalized(
                    {
                      ...cartFinalized,
                      cartId: cart.cartId,
                    },
                    paymentMethodId,
                  );

                  if (!resultFinalize.continueProcessing) {
                    setIsSubmitting(false);
                    resolve(resultFinalize.dataToReturn);
                    return;
                  }
                }
                setIsSubmitting(false);
                resolve(true);
              },
              onError: (err) => {
                setIsSubmitting(false);
                addError(t('pci_project_new_payment_create_error'));
                reject(err);
              },
            },
          );
        });
      } catch (error) {
        setIsSubmitting(false);
        addError(t('pci_project_new_payment_create_error'));
        return false;
      }
    },
    [paymentHandlerRef, cart, isSubmitting],
  );

  const onPaymentSuccess = useCallback((paymentMethodId: number) => {
    handlePaymentSubmit({ paymentMethodId, skipRegistration: true });
  }, []);

  const onPaymentError = useCallback(() => {
    addError(t('pci_project_new_payment_create_error'));
  }, []);

  usePaymentRedirect({
    onPaymentError,
    onPaymentSuccess,
  });

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
            action: () => handlePaymentSubmit({ skipRegistration: false }),
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
            onPaymentSubmit={handlePaymentSubmit}
          />
        </StepComponent>
      </div>
    </div>
  );
}
