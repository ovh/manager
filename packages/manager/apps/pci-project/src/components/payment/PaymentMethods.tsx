import React, { useEffect, useImperativeHandle } from 'react';
import { OdsSpinner } from '@ovhcloud/ods-components/react';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import {
  eligibilityQueryKey,
  useEligibility,
} from '@/data/hooks/payment/useEligibility';
import DefaultPaymentMethod from './DefaultPaymentMethod';
import {
  paymentMethodQueryKey,
  usePaymentMethods,
} from '@/data/hooks/payment/usePaymentMethods';
import RegisterPaymentMethod from './RegisterPaymentMethod';
import {
  TPaymentCallbackRegisterReturnType,
  TPaymentCallbackReturnType,
  TPaymentMethod,
  TPaymentMethodIntegrationRef,
} from '@/data/types/payment/payment-method.type';
import PaymentMethodChallenge, {
  TPaymentMethodChallengeRef,
} from './PaymentMethodChallenge';
import queryClient from '@/queryClient';
import PaymentMethodIntegration from './integrations/PaymentMethodIntegration';
import { TCart } from '@/data/types/payment/cart.type';

export type TPaymentMethodError =
  | 'challenge_retry'
  | 'payment_method_deactivated';

export type PaymentMethodsProps = {
  paymentMethodHandler: React.Ref<TPaymentMethodRef>;
  handlePaymentMethodChange?: (method: TPaymentMethod) => void;
  handleSetAsDefaultChange?: (value: boolean) => void;
  handleValidityChange?: (isValid: boolean) => void;
  cartId: string;
  itemId: number;
  preselectedPaymentType?: string | null;
  handleCustomSubmitButton?: (btn: string | JSX.Element) => void;
  onPaymentSubmit: ({
    paymentMethodId,
    skipRegistration,
  }: {
    paymentMethodId?: number;
    skipRegistration?: boolean;
  }) => Promise<unknown>;
};

export type TPaymentMethodRef = {
  submitPaymentMethod: (
    cart: TCart,
  ) => Promise<TPaymentCallbackRegisterReturnType>;
  onCheckoutRetrieved?: (
    cart: TCart,
    paymentMethodId?: number,
  ) => Promise<TPaymentCallbackReturnType>;
  onCartFinalized?: (
    cart: TCart,
    paymentMethodId?: number,
  ) => Promise<TPaymentCallbackReturnType>;
};

/**
 * PaymentMethods component that handles payment method selection, validation, and challenge processes.
 *
 * This component manages the display of default payment methods or registration of new ones,
 * handles payment method challenges, and provides callbacks for validation state changes.
 *
 * @component
 * @example
 * ```tsx
 * const [isPaymentValid, setIsPaymentValid] = useState(false);
 * const handlePaymentValidityChange = (isValid: boolean) => {
 *   // Handle payment method validity change
 *   console.log('Payment method validity changed:', isValid);
 *   setIsPaymentValid(isValid);
 * };
 *
 * const paymentMethodRef = React.useRef<TPaymentMethodRef>(null);
 *
 * const handleSubmit = () => {
 *   // Handle click event for payment method challenge
 *   console.log('Create projet clicked');
 *   if (paymentMethodRef.current) {
 *     paymentMethodRef.current
 *       .submitPaymentMethod()
 *       .then(() => {
 *         console.log('Payment method submitted successfully');
 *       })
 *       .catch((paymentMethodError) => {
 *         console.error('Error submitting payment method:', paymentMethodError);
 *
 *         const errorReason = paymentMethodError.message as TPaymentMethodError;
 *
 *         if (errorReason === 'payment_method_deactivated') {
 *           addError(
 *             t(
 *               'pci_project_new_payment_challenge_error_payment_method_deactivated',
 *             ),
 *           );
 *         }
 *       });
 *   }
 * };
 *
 * return (
 *   <PaymentMethods
 *     paymentMethodHandler={paymentMethodRef}
 *     handlePaymentMethodChange={(method) => console.log('Selected method:', method)}
 *     handleSetAsDefaultChange={(isDefault) => console.log('Set as default:', isDefault)}
 *     handleValidityChange={handlePaymentValidityChange}
 *   />
 *   <button onClick={handleSubmit} disabled={!isPaymentValid}>
 *     Submit
 *   </button>
 * );
 * ```
 *
 * @param props - The component props
 * @param props.paymentMethodHandler - Ref to access payment method submission functionality
 * @param props.handlePaymentMethodChange - Optional callback when payment method selection changes
 * @param props.handleSetAsDefaultChange - Optional callback when default payment method setting changes
 * @param props.handleValidityChange - Optional callback when payment method validity state changes
 *
 * @returns JSX element containing payment method components
 */
const PaymentMethods: React.FC<PaymentMethodsProps> = ({
  handlePaymentMethodChange = () => {},
  handleSetAsDefaultChange = () => {},
  handleValidityChange = () => {},
  paymentMethodHandler,
  cartId,
  itemId,
  handleCustomSubmitButton,
  preselectedPaymentType,
  onPaymentSubmit,
}) => {
  const {
    data: eligibility,
    isLoading: isLoadingEligibility,
  } = useEligibility();
  const defaultPaymentMethodsParams = {
    default: true,
  };
  const {
    data: defaultPaymentMethods,
    isLoading: isLoadingDefault,
  } = usePaymentMethods(defaultPaymentMethodsParams);

  const [isValid, setIsValid] = React.useState<boolean>(false);
  const [isChallengeValid, setIsChallengeValid] = React.useState<boolean>(
    false,
  );
  const [
    isPaymentMethodIntegrationValid,
    setIsPaymentMethodIntegrationValid,
  ] = React.useState<boolean>(false);
  const [
    selectedPaymentMethod,
    setSelectedPaymentMethod,
  ] = React.useState<TPaymentMethod | null>(null);
  const [isSetAsDefault, setIsSetAsDefault] = React.useState<boolean>(false);

  const defaultPaymentMethod = defaultPaymentMethods?.data?.[0];

  const onHandlePaymentMethodChange = (method: TPaymentMethod) => {
    setSelectedPaymentMethod(method);
    handlePaymentMethodChange(method);
  };

  const onHandleSetAsDefaultChange = (value: boolean) => {
    setIsSetAsDefault(value);
    handleSetAsDefaultChange(value);
  };

  useEffect(() => {
    if (defaultPaymentMethod) {
      onHandlePaymentMethodChange(defaultPaymentMethod);
      onHandleSetAsDefaultChange(defaultPaymentMethod.default || false);
    }
  }, [defaultPaymentMethod]);

  useEffect(() => {
    // Here we check if everything is ok about the payment method

    // A payment method is selected and is set as default
    const hasValidPaymentMethod = !!selectedPaymentMethod && isSetAsDefault;

    // When there's a default payment method, we don't need PaymentMethodIntegration validation
    // because PaymentMethodIntegration is only rendered when there's no default payment method
    const needsIntegrationValidation = !defaultPaymentMethod;
    const integrationValid = needsIntegrationValidation
      ? isPaymentMethodIntegrationValid
      : true;

    const isValidGlobal =
      isChallengeValid && hasValidPaymentMethod && integrationValid;

    setIsValid(isValidGlobal);
    handleValidityChange(isValidGlobal);
  }, [
    isChallengeValid,
    isPaymentMethodIntegrationValid,
    defaultPaymentMethod,
    handleValidityChange,
    selectedPaymentMethod,
    isSetAsDefault,
  ]);

  const paymentChallengeRef = React.useRef<TPaymentMethodChallengeRef>(null);
  const paymentHandlerRef = React.useRef<TPaymentMethodIntegrationRef>(null);

  useImperativeHandle(
    paymentMethodHandler,
    () => {
      return {
        submitPaymentMethod: async (cart: TCart) => {
          const needsIntegration = !defaultPaymentMethod;

          if (!selectedPaymentMethod || !isValid) {
            throw new Error('payment_method_invalid');
          }

          if (paymentChallengeRef.current && !needsIntegration) {
            const status = await paymentChallengeRef.current.submitChallenge();
            switch (status) {
              case 'deactivated':
                // Default payment method is deactivated, we can invalidate the query to refresh the data
                // There should not be any default payment method after this
                // Which will trigger the RegisterPaymentMethod component to be displayed
                queryClient.invalidateQueries({
                  queryKey: paymentMethodQueryKey(defaultPaymentMethodsParams),
                });
                queryClient.invalidateQueries({
                  queryKey: eligibilityQueryKey(),
                });
                throw new Error('payment_method_deactivated');
              case 'retry':
                throw new Error('challenge_retry');
              default:
                // The challenge was successful, we can continue the submission
                if (
                  paymentHandlerRef.current &&
                  paymentHandlerRef.current.registerPaymentMethod
                ) {
                  return paymentHandlerRef.current.registerPaymentMethod(
                    selectedPaymentMethod,
                    cart,
                  );
                }
                return { continueProcessing: true };
            }
          } else if (
            paymentHandlerRef.current &&
            paymentHandlerRef.current.registerPaymentMethod &&
            needsIntegration
          ) {
            return paymentHandlerRef.current.registerPaymentMethod(
              selectedPaymentMethod,
              cart,
            );
          }

          return { continueProcessing: true };
        },
        onCheckoutRetrieved: async (cart: TCart, paymentMethodId?: number) => {
          const needsIntegration = !defaultPaymentMethod;

          if (
            paymentHandlerRef.current &&
            paymentHandlerRef.current.onCheckoutRetrieved &&
            needsIntegration
          ) {
            return paymentHandlerRef.current.onCheckoutRetrieved(
              cart,
              paymentMethodId,
            );
          }
          return { continueProcessing: true };
        },
        onCartFinalized: async (cart: TCart, paymentMethodId?: number) => {
          const needsIntegration = !defaultPaymentMethod;

          if (
            paymentHandlerRef.current &&
            paymentHandlerRef.current.onCartFinalized &&
            needsIntegration
          ) {
            return paymentHandlerRef.current.onCartFinalized(
              cart,
              paymentMethodId,
            );
          }
          return { continueProcessing: true };
        },
      };
    },
    [
      paymentChallengeRef,
      paymentHandlerRef,
      selectedPaymentMethod,
      isValid,
      defaultPaymentMethod,
    ],
  );

  if (isLoadingDefault || isLoadingEligibility || !eligibility) {
    return <OdsSpinner size={ODS_SPINNER_SIZE.md} />;
  }

  return (
    <div>
      {defaultPaymentMethod ? (
        <DefaultPaymentMethod method={defaultPaymentMethod} />
      ) : (
        <RegisterPaymentMethod
          eligibility={eligibility}
          handlePaymentMethodChange={onHandlePaymentMethodChange}
          handleSetAsDefaultChange={onHandleSetAsDefaultChange}
          preselectedPaymentType={preselectedPaymentType}
        />
      )}
      <PaymentMethodChallenge
        eligibility={eligibility}
        challengeHandler={paymentChallengeRef}
        paymentMethod={defaultPaymentMethod}
        handleValidityChange={(valid) => setIsChallengeValid(valid)}
      />
      {!defaultPaymentMethod && (
        <div className="mb-6">
          <PaymentMethodIntegration
            paymentMethod={selectedPaymentMethod}
            handleValidityChange={(valid) =>
              setIsPaymentMethodIntegrationValid(valid)
            }
            eligibility={eligibility}
            paymentHandler={paymentHandlerRef}
            cartId={cartId}
            itemId={itemId}
            handleCustomSubmitButton={handleCustomSubmitButton}
            onPaymentSubmit={onPaymentSubmit}
            isSetAsDefault={isSetAsDefault}
          />
        </div>
      )}
    </div>
  );
};

export default PaymentMethods;
