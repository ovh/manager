import { useCallback, useState } from 'react';
import { useFinalizePaymentMethod } from '@/data/hooks/payment/usePaymentMethods';
import { PaymentData, PayPalAuthorizationData } from '../types';

interface UsePayPalPaymentProps {
  onPaymentSubmit: (skipRegistration?: boolean) => Promise<boolean | unknown>;
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

interface UsePayPalPaymentReturn {
  paymentData: PaymentData | null;
  setPaymentData: (data: PaymentData | null) => void;
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
  onSuccess,
  onError,
}: UsePayPalPaymentProps): UsePayPalPaymentReturn => {
  const [paymentData, setPaymentData] = useState<PaymentData | null>(null);

  const { mutateAsync: finalizePaymentMethod } = useFinalizePaymentMethod({
    onSuccess,
    onError,
  });

  const handlePayment = useCallback(async (): Promise<string> => {
    const result = await onPaymentSubmit(false);
    return String(result);
  }, [onPaymentSubmit]);

  const handleAuthorize = useCallback(async () => {
    if (!paymentData) {
      throw new Error('Payment data is missing');
    }

    // Finalize payment method
    await finalizePaymentMethod({
      paymentMethodId: paymentData.paymentMethodId,
      params: {
        formSessionId: paymentData.formSessionId,
      },
    });

    // Complete payment process (skipRegistration=true since already done)
    await onPaymentSubmit(true);
  }, [paymentData, finalizePaymentMethod, onPaymentSubmit]);

  const handleError = useCallback((error: Error) => onError?.(error), [
    onError,
  ]);

  return {
    paymentData,
    setPaymentData,
    handlePayment,
    handleAuthorize,
    handleError,
  };
};
