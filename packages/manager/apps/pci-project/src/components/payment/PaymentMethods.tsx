import React, { useEffect, useImperativeHandle } from 'react';
import { OdsSpinner } from '@ovhcloud/ods-components/react';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import {
  eligibilityQueryKey,
  useEligibility,
} from '@/data/hooks/payment/useEligibility';
import DefaultPaymentMethod from './DefaultPaymentMethod';
import {
  paymentMathodQueryKey,
  usePaymentMethods,
} from '@/data/hooks/payment/usePaymentMethods';
import RegisterPaymentMethod from './RegisterPaymentMethod';
import { TPaymentMethod } from '@/data/types/payment/payment-method.type';
import PaymentMethodChallenge, {
  TPaymentMethodChallengeRef,
} from './PaymentMethodChallenge';
import queryClient from '@/queryClient';

export type TPaymentMethodError =
  | 'challenge_retry'
  | 'payment_method_deactivated';

export type PaymentMethodsProps = {
  paymentMethodHandler: React.Ref<TPaymentMethodRef>;
  handlePaymentMethodChange?: (method: TPaymentMethod) => void;
  handleSetAsDefaultChange?: (value: boolean) => void;
  handleValidityChange?: (isValid: boolean) => void;
};

export type TPaymentMethodRef = {
  submitPaymentMethod: () => Promise<boolean>;
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

  const [isChallengeValid, setIsChallengeValid] = React.useState<boolean>(
    false,
  );
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

    const isValid = isChallengeValid && hasValidPaymentMethod;

    handleValidityChange(isValid);
  }, [
    isChallengeValid,
    handleValidityChange,
    selectedPaymentMethod,
    isSetAsDefault,
  ]);

  const paymentChallengeRef = React.useRef<TPaymentMethodChallengeRef>(null);

  useImperativeHandle(
    paymentMethodHandler,
    () => {
      return {
        submitPaymentMethod: async () => {
          if (paymentChallengeRef.current) {
            const status = await paymentChallengeRef.current.submitChallenge();
            switch (status) {
              case 'deactivated':
                // Default payment method is deactivated, we can invalidate the query to refresh the data
                // There should not be any default payment method after this
                // Which will trigger the RegisterPaymentMethod component to be displayed
                queryClient.invalidateQueries({
                  queryKey: paymentMathodQueryKey(defaultPaymentMethodsParams),
                });
                queryClient.invalidateQueries({
                  queryKey: eligibilityQueryKey(),
                });
                throw new Error('payment_method_deactivated');
              case 'retry':
                throw new Error('challenge_retry');
              default:
                // The challenge was successful, we can resolve the promise
                return true;
            }
          }
          return true;
        },
      };
    },
    [paymentChallengeRef],
  );

  if (isLoadingDefault || isLoadingEligibility || !eligibility) {
    return <OdsSpinner size={ODS_SPINNER_SIZE.md} />;
  }

  return (
    <>
      {defaultPaymentMethod ? (
        <DefaultPaymentMethod method={defaultPaymentMethod} />
      ) : (
        <RegisterPaymentMethod
          eligibility={eligibility}
          handlePaymentMethodChange={handlePaymentMethodChange}
          handleSetAsDefaultChange={handleSetAsDefaultChange}
        />
      )}
      <div className="mb-6">
        <PaymentMethodChallenge
          eligibility={eligibility}
          challengeHandler={paymentChallengeRef}
          paymentMethod={defaultPaymentMethod}
          handleValidityChange={(isValid) => setIsChallengeValid(isValid)}
        />
      </div>
    </>
  );
};

export default PaymentMethods;
