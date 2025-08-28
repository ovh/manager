import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

type UsePaymentRedirectProps = {
  onPaymentError: () => void;
  onPaymentSuccess: (paymentMethodId: number) => void;
};

export const usePaymentRedirect = ({
  onPaymentError,
  onPaymentSuccess,
}: UsePaymentRedirectProps) => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const status = searchParams.get('paymentStatus');
    const paymentMethodId = searchParams.get('paymentMethodId');

    if (!status || !paymentMethodId) return;

    if (['cancel', 'error', 'failure'].includes(status)) {
      onPaymentError();
    } else if (['success', 'pending'].includes(status)) {
      onPaymentSuccess(Number(paymentMethodId));
    }
  }, [searchParams, onPaymentError, onPaymentSuccess]);
};
