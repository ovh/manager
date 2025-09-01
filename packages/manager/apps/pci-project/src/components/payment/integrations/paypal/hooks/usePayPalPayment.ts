import { useCallback } from 'react';
import { useFinalizePaymentMethod } from '@/data/hooks/payment/usePaymentMethods';
import { TRegisterPaymentMethod } from '@/data/types/payment/payment-method.type';
import extractParamFromUrl from '@/utils/extract-param-from-url';
import { PayPalAuthorizationData } from '../types';

interface UsePayPalPaymentProps {
  onPaymentSubmit: ({
    skipRegistration,
    paymentMethodId,
  }: {
    skipRegistration?: boolean;
    paymentMethodId?: number;
  }) => Promise<unknown>;
  onError?: (error: Error) => void;
}

interface UsePayPalPaymentReturn {
  handlePayment: () => Promise<string>;
  handleAuthorize: (data: PayPalAuthorizationData) => Promise<void>;
  handleError: (error: Error) => void;
}

/**
 * Custom hook to manage PayPal payment logic
 * Separates business logic from user interface
 */
export const usePayPalPayment = ({
  onPaymentSubmit,
  onError,
}: UsePayPalPaymentProps): UsePayPalPaymentReturn => {
  const { mutateAsync: finalizePaymentMethod } = useFinalizePaymentMethod({
    onError,
  });

  const handlePayment = useCallback(async (): Promise<string> => {
    const addPaymentMethodResponse = (await onPaymentSubmit({
      skipRegistration: false,
    })) as TRegisterPaymentMethod;

    return `${addPaymentMethodResponse.formSessionId}`;
  }, [onPaymentSubmit]);

  const handleAuthorize = useCallback(
    async (data: PayPalAuthorizationData) => {
      const formSessionId = data.billingToken;
      const paymentMethodId =
        data.paymentID ||
        extractParamFromUrl({
          url: data.returnUrl,
          paramName: 'paymentMethodId',
        });

      if (!paymentMethodId || !formSessionId) {
        throw new Error('Payment data are missing');
      }

      // Finalize payment method
      await finalizePaymentMethod({
        paymentMethodId: Number(paymentMethodId),
        params: {
          formSessionId,
        },
      });

      // Complete payment process (skipRegistration=true since already done)
      await onPaymentSubmit({
        skipRegistration: true,
        paymentMethodId: Number(paymentMethodId),
      });
    },
    [finalizePaymentMethod, onPaymentSubmit],
  );

  const handleError = useCallback(
    (error: Error) => {
      onError?.(error);
    },
    [onError],
  );

  return {
    handlePayment,
    handleAuthorize,
    handleError,
  };
};
