import {
  useAddPaymentMethod,
  useFinalizePaymentMethod,
} from '@/data/hooks/payment/usePaymentMethods';
import { TPaymentMethodType } from '@/data/types/payment/payment-method.type';
import { urls } from '@/routes/routes.constant';
import { useProjectUrl } from '@ovh-ux/manager-react-components';
import {
  CreateOrderActions,
  CreateOrderData,
  OnApproveActions,
  OnApproveData,
} from '@paypal/paypal-js';
import { PayPalButtons } from '@paypal/react-paypal-js';
import { useCallback } from 'react';

interface PaypalPaymentProps {
  isDisabled?: boolean;
  isDefault?: boolean;
}

export default function PaypalPayment({
  isDisabled = false,
  isDefault = false,
}: PaypalPaymentProps) {
  const projectUrl = useProjectUrl('public-cloud');
  const callbackUrls = {
    success: `${projectUrl}/${urls.creation}?paypal=success`,
    pending: `${projectUrl}/${urls.creation}?paypal=pending`,
    error: `${projectUrl}/${urls.creation}?paypal=error`,
    cancel: `${projectUrl}/${urls.creation}?paypal=cancel`,
    failure: `${projectUrl}/${urls.creation}?paypal=failure`,
  };

  // const { data: paypalChargeAmount } = usePaypalChargeAmount();
  const paypalChargeAmount = 1;

  const {
    mutate: addPaymentMethod,
    data: addPaymentMethodResponse,
  } = useAddPaymentMethod();

  const { mutate: finalizePayment } = useFinalizePaymentMethod();

  const onCreateOrder = useCallback(
    async (_data: CreateOrderData, actions: CreateOrderActions) => {
      const postData = {
        paymentType: TPaymentMethodType.PAYPAL,
        default: isDefault,
        register: true,
        callbackUrl: callbackUrls,
      };

      await addPaymentMethod(postData);

      return actions.order.create({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              value: `${paypalChargeAmount}`,
            },
          },
        ],
      });
    },
    [isDefault, callbackUrls, paypalChargeAmount],
  );

  const onApproveOrder = useCallback(
    async (_data: OnApproveData, actions: OnApproveActions) => {
      actions.order
        ?.capture()
        .then((details) => {
          finalizePayment({
            paymentMethodId: `${addPaymentMethodResponse?.paymentMethodId}`,
            params: {
              formSessionId: `${addPaymentMethodResponse?.formSessionId}`,
              registrationId: details?.id ?? '',
            },
          });
        })
        .catch((error: Record<string, unknown>) => {
          throw new Error(`PayPal: Error capturing order: ${error}`);
        });
    },
    [addPaymentMethodResponse],
  );

  // const handleCancel = useCallback((data: Record<string, unknown>) => {
  //   console.log('PayPal: Payment cancelled by user', data);
  // }, []);

  // const handleError = useCallback((err: Record<string, unknown>) => {
  //   console.error('PayPal: Payment error:', err);
  // }, []);

  return (
    <PayPalButtons
      createOrder={onCreateOrder}
      onApprove={onApproveOrder}
      // onCancel={handleCancel}
      // onError={handleError}
      disabled={isDisabled}
    />
  );
}
