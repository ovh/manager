import { v6 } from '@ovh-ux/manager-core-api';

export const payWithRegisteredPaymentMean = async (
  orderId: number,
  payload: {
    paymentMean: string;
  },
): Promise<void> => {
  await v6.post<void>(
    `me/order/${orderId}/payWithRegisteredPaymentMean`,
    payload,
  );
};
