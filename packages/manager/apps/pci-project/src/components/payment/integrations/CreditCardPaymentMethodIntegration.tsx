import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useState,
} from 'react';
import { OdsText } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { TCart } from '@/data/types/payment/cart.type';
import {
  TAvailablePaymentMethod,
  TPaymentMethodIntegrationRef,
  TRegisterPaymentMethod,
} from '@/data/types/payment/payment-method.type';
import { FormState, useAdyenSDK } from './adyen/hooks/useAdyenSDK';
import { TPaymentFeaturesState } from '@/data/hooks/payment/usePaymentFeatureAvailabilities';
import { constructPostParams, parseFormSessionId } from './adyen/utils';

const MAIN_CONTAINER_ID = 'adyen-component-container';
const ADDITIONAL_CONTAINER_ID = 'adyen-additional-action-container';

interface CreditCardMethodIntegrationProps {
  handleCustomSubmitButton?: (btn: string | JSX.Element) => void;
  paymentHandler: React.Ref<TPaymentMethodIntegrationRef>;
  onPaymentSubmit: ({
    paymentMethodId,
    skipRegistration,
  }: {
    paymentMethodId?: number;
    skipRegistration?: boolean;
  }) => Promise<unknown>;
  onPaymentError: (err: string | undefined) => void;
  handleValidityChange: (isValid: boolean) => void;
  paymentMethod: TAvailablePaymentMethod;
  features: TPaymentFeaturesState;
}

const CreditCardPaymentMethodIntegration: React.FC<CreditCardMethodIntegrationProps> = ({
  handleCustomSubmitButton,
  paymentHandler,
  onPaymentSubmit,
  onPaymentError,
  handleValidityChange,
  paymentMethod,
  features,
}) => {
  const { t } = useTranslation(['new/payment', 'payment/integrations/adyen']);
  const [showAdyen, setShowAdyen] = useState(false);
  const [formState, setFormState] = useState<FormState | undefined>(undefined);
  const [searchParams] = useSearchParams();
  const [isAdditionalDetailsSaved, setIsAdditionalDetailsSaved] = useState(
    false,
  );
  const [hasAskedForDetails, setHasAskedForDetails] = useState<boolean>(false);

  const handleFormChange = useCallback((state: FormState) => {
    setFormState(state);
  }, []);

  const onRegisterSuccess = useCallback((paymentMethodId: number) => {
    onPaymentSubmit({
      paymentMethodId,
      skipRegistration: true,
    });
    setHasAskedForDetails(false);
    setIsAdditionalDetailsSaved(true);
  }, []);
  const onRegisterError = useCallback(
    (error: string) => {
      setHasAskedForDetails(false);
      onPaymentError(error);
    },
    [onPaymentError],
  );

  // Adyen SDK management
  const {
    scriptLoaded,
    handleAdditionalAction,
    setAdditionalDetails,
  } = useAdyenSDK(
    showAdyen,
    MAIN_CONTAINER_ID,
    ADDITIONAL_CONTAINER_ID,
    paymentMethod,
    features,
    handleFormChange,
    onRegisterSuccess,
    onRegisterError,
  );

  // Component validity management
  useEffect(() => {
    if (!showAdyen) {
      handleValidityChange(true);
    } else if (scriptLoaded) {
      // Here we should check the Adyen component validity
      handleValidityChange(!!formState?.isValid && !hasAskedForDetails);
    }
  }, [scriptLoaded, showAdyen, formState?.isValid, hasAskedForDetails]);

  useEffect(() => {
    if (!handleCustomSubmitButton) return;

    if (!showAdyen) {
      handleCustomSubmitButton(
        t('pci_project_new_payment_btn_continue_add_credit_card', {
          ns: 'new/payment',
        }),
      );
    } else if (scriptLoaded) {
      handleCustomSubmitButton(
        t('ovh_payment_method_integration_component_adyen_validate', {
          ns: 'payment/integrations/adyen',
        }),
      );
    }
  }, [scriptLoaded, showAdyen]);

  // Parent interface
  useImperativeHandle(
    paymentHandler,
    () => ({
      submitPayment: async () => {
        if (!showAdyen) {
          setShowAdyen(true);
          return { continueProcessing: false };
        }
        if (scriptLoaded && formState && formState.isValid) {
          const adyenPostParams = constructPostParams(formState);

          return {
            continueProcessing: true,
            registerPostData: adyenPostParams,
          };
        }
        return { continueProcessing: true };
      },
      onPaymentMethodRegistered: async (
        _paymentMethod: TAvailablePaymentMethod,
        _cart: TCart,
        registerPaymentMethod?: TRegisterPaymentMethod,
      ) => {
        if (!registerPaymentMethod) {
          return { continueProcessing: false };
        }

        const adyenResponse = parseFormSessionId(
          registerPaymentMethod.formSessionId,
        );

        if (adyenResponse.action) {
          // We handle addition actions before validating the payment method
          const currAdditionalAction = {
            action: adyenResponse.action,
            paymentMethodId: registerPaymentMethod.paymentMethodId,
            transactionId: registerPaymentMethod.transactionId,
          };
          setHasAskedForDetails(true);
          handleAdditionalAction(currAdditionalAction);

          return { continueProcessing: false };
        }
        return { continueProcessing: true };
      },
      checkPaymentMethod: async (_cart: TCart, paymentMethodId?: number) => {
        const redirectResult = searchParams.get('redirectResult');
        const transactionId = searchParams.get('transactionId');

        if (
          redirectResult &&
          transactionId &&
          paymentMethodId &&
          !isAdditionalDetailsSaved
        ) {
          setHasAskedForDetails(true);
          setAdditionalDetails(
            { redirectResult },
            parseInt(transactionId, 10),
            paymentMethodId,
          );
          return { continueProcessing: false };
        }

        return { continueProcessing: true };
      },
      onCheckoutRetrieved: async () => {
        return { continueProcessing: true };
      },
      onCartFinalized: async () => {
        return { continueProcessing: true };
      },
    }),
    [
      showAdyen,
      scriptLoaded,
      formState,
      searchParams,
      isAdditionalDetailsSaved,
    ],
  );

  return (
    <>
      {scriptLoaded && (
        <OdsText preset={ODS_TEXT_PRESET.heading2} className="mb-6">
          {t('pci_project_new_payment_information', { ns: 'new/payment' })}
        </OdsText>
      )}
      <div id="adyen-container" className="adyen-container">
        <div
          id={MAIN_CONTAINER_ID}
          className="mb-4 adyen-component-container"
        ></div>
        <div id={ADDITIONAL_CONTAINER_ID}></div>
      </div>
    </>
  );
};

export default CreditCardPaymentMethodIntegration;
