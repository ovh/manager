import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

type UsePaymentRedirectProps = {
  onPaymentError: () => void;
  onPaymentSuccess: (paymentMethodId: number) => void;
};

export const usePaymentRedirect = (
  isEnabled: boolean,
  { onPaymentError, onPaymentSuccess }: UsePaymentRedirectProps,
) => {
  const [searchParams] = useSearchParams();
  const [isCalled, setIsCalled] = useState(false);

  useEffect(() => {
    const status = searchParams.get('paymentStatus');
    const paymentMethodId = searchParams.get('paymentMethodId');

    if (!isEnabled || !status || isCalled) return;

    setIsCalled(true);

    if (['cancel', 'error', 'failure'].includes(status)) {
      onPaymentError();
    } else if (['success', 'pending'].includes(status)) {
      if (!paymentMethodId) {
        return;
      }
      onPaymentSuccess(Number(paymentMethodId));
    }
  }, [searchParams, isCalled, onPaymentError, onPaymentSuccess, isEnabled]);
};
