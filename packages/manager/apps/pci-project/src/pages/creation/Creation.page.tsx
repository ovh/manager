import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  Notifications,
  OvhSubsidiary,
  StepComponent,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import { OdsLink, OdsText } from '@ovhcloud/ods-components/react';
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
import {
  checkoutCart,
  getCartCheckout,
  attachConfigurationToCartItem as postAttachConfigurationToCartItem,
} from '@/data/api/cart';
import { CartSummary } from '@/data/types/cart.type';
import { usePaymentRedirect } from '@/hooks/payment/usePaymentRedirect';
import { AntiFraudError, PCI_PROJECT_ORDER_CART } from '@/constants';
import useAntiFraud from './hooks/useAntiFraud';

export default function ProjectCreation() {
  const { t } = useTranslation([
    'new/config',
    'new/payment',
    NAMESPACES.ACTIONS,
  ]);

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const {
    environment,
    shell: { navigation },
  } = useContext(ShellContext);
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
  const [needToCheckCustomerInfo, setNeedToCheckCustomerInfo] = useState<
    boolean
  >(false);
  const [billingHref, setBillingHref] = React.useState<string>('');
  const [orderId, setOrderId] = React.useState<number | null>(null);
  const { checkAntiFraud } = useAntiFraud();

  useEffect(() => {
    if (orderId) {
      navigation
        .getURL('dedicated', '#/billing/orders/:orderId', { orderId })
        .then((url) => setBillingHref(`${url}`));
    }
  }, [navigation, orderId]);

  const { addError, addWarning } = useNotifications();

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

        // Step 1 : Register payment method
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

        // Step 2: Check payment method
        if (paymentHandlerRef.current.checkPaymentMethod) {
          const resultCheck = await paymentHandlerRef.current.checkPaymentMethod(
            cart,
            currentPaymentMethodId,
          );

          if (!resultCheck.continueProcessing) {
            setIsSubmitting(false);
            return resultCheck.dataToReturn;
          }
        }

        if (!projectItem) {
          throw new Error('Project item not found');
        }

        // Step 3: Attach configuration to cart item
        await postAttachConfigurationToCartItem(
          cart.cartId,
          projectItem.itemId,
          {
            label: 'infrastructure',
            value: PCI_PROJECT_ORDER_CART.infraConfigValue,
          },
        );

        // Step 4: Get checkout info
        const cartCheckoutInfo = await getCartCheckout(cart.cartId);

        // Step 5: Callback after checkout received
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

        // Step 6: Finalize cart
        const cartFinalized: CartSummary = await checkoutCart(cart.cartId);

        setOrderId(cartFinalized.orderId);

        // Step 7: Callback after cart is finalized
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
            return resultFinalize.dataToReturn;
          }
        }

        // Step 8: Anti-fraud check
        try {
          await checkAntiFraud(cartFinalized);
        } catch (err) {
          const antiFraudError = err as AntiFraudError;

          setIsSubmitting(false);

          switch (antiFraudError) {
            case AntiFraudError.CASE_FRAUD_REFUSED:
              addError(
                t(
                  'pci_project_new_payment_check_anti_fraud_case_fraud_refused',
                  {
                    ns: 'new/payment',
                  },
                ),
              );
              break;
            case AntiFraudError.NEED_CUSTOMER_INFO_CHECK:
              setNeedToCheckCustomerInfo(true);
              addWarning(
                t('pci_project_new_payment_create_error_fraud_suspect', {
                  ns: 'new/payment',
                }),
              );
              break;
            default:
              addError(
                t('pci_project_new_payment_create_error', {
                  ns: 'new/payment',
                }),
              );
              break;
          }

          return false;
        }

        // Step 9: Redirect to the project creation finalization page
        setIsSubmitting(false);

        if (cartFinalized.orderId) {
          const voucherCode = searchParams.get('voucher');

          if (voucherCode) {
            navigation.navigateTo(
              'public-cloud',
              '#/pci/projects/creating/:orderId/:voucherCode',
              { orderId: cartFinalized.orderId, voucherCode },
            );
          } else {
            navigation.navigateTo(
              'public-cloud',
              '#/pci/projects/creating/:orderId',
              { orderId: cartFinalized.orderId },
            );
          }
        }

        return true;
      } catch (error) {
        setIsSubmitting(false);
        addError(
          t('pci_project_new_payment_create_error', { ns: 'new/payment' }),
        );
        return false;
      }
    },
    [
      paymentHandlerRef,
      cart,
      isSubmitting,
      projectItem,
      needToCheckCustomerInfo,
      searchParams,
    ],
  );

  const onPaymentSuccess = useCallback(
    (paymentMethodId: number) => {
      handlePaymentSubmit({ paymentMethodId, skipRegistration: true });
    },
    [cart, paymentHandlerRef, isSubmitting],
  );

  const onPaymentError = useCallback(() => {
    addError(t('pci_project_new_payment_create_error', { ns: 'new/payment' }));
  }, []);

  const isPageReady = !!cart && !!paymentHandlerRef.current;

  usePaymentRedirect(isPageReady, {
    onPaymentError,
    onPaymentSuccess,
  });

  if (!cart || !projectItem) {
    return <FullPageSpinner />;
  }

  const isPaymentStepLoading = isSubmitting;
  const isPaymentStepDisabled =
    !isPaymentMethodValid || isSubmitting || needToCheckCustomerInfo;
  const paymentStepNextCustomButton: string | JSX.Element =
    customSubmitButton ||
    t('pci_project_new_payment_btn_continue_default', {
      ns: 'new/payment',
    });

  const paymentStepNextCustomButtonWithProps: string | JSX.Element =
    typeof paymentStepNextCustomButton === 'string'
      ? paymentStepNextCustomButton
      : React.cloneElement(paymentStepNextCustomButton, {
          isDisabled: isPaymentStepDisabled,
          isLoading: isPaymentStepLoading,
        });

  const paymentStepNextButton:
    | string
    | JSX.Element = needToCheckCustomerInfo ? (
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
    paymentStepNextCustomButtonWithProps
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
            action: () => handlePaymentSubmit({ skipRegistration: false }),
            label: paymentStepNextButton,
            isDisabled: isPaymentStepDisabled,
            isLoading: isPaymentStepLoading,
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
            onPaymentError={onPaymentError}
          />
        </StepComponent>
      </div>
    </div>
  );
}
