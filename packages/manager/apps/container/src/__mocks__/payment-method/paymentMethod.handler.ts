import { Handler } from "@ovh-ux/manager-core-test-utils";
import { expiredPaymentMethod, validPaymentMethod } from "./paymentMethod.data";

export const getPaymentMethodMocks = (params: {
  hasPaymentMethods?: boolean;
  status?: 'VALID' | 'EXPIRED';
} = {}): Handler[] => {
  const { hasPaymentMethods = false, status = 'VALID' } = params;

  if (!hasPaymentMethods) {
    return [
      {
        url: 'me/payment/method',
        response: [],
        api: 'v6',
        delay: 0,
      },
    ];
  }

  return [
    {
      url: 'me/payment/method',
      response: [1],
      api: 'v6',
      delay: 0,
    },
    {
      url: 'me/payment/method/1',
      response: status === 'EXPIRED' ? expiredPaymentMethod : validPaymentMethod,
      api: 'v6',
      delay: 0,
    },
  ];
};
