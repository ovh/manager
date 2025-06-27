import { useQuery } from '@tanstack/react-query';
import { getAvailablePaymentMethods } from '@/data/api/payment/payment-method';
import { FALLBACK_ICONS } from '@/payment/constants';

export const availablePaymentMethodQueryKey = () => [
  'me',
  'payment',
  'availableMethods',
];

export const useAvailablePaymentMethods = () => {
  return useQuery({
    queryKey: availablePaymentMethodQueryKey(),
    queryFn: getAvailablePaymentMethods,
    throwOnError: true,
    select: (data) => ({
      ...(data || {}),
      data: data.data?.map((method) => ({
        ...method,
        readableName: {
          key: `ovh_payment_type_${method.paymentType.toLowerCase()}`,
          ns: 'payment/register/payment-types',
        },
        icon: {
          ...(method.icon || {}),
          data:
            !method.icon?.data && !method.icon?.url
              ? FALLBACK_ICONS[
                  method.paymentType as keyof typeof FALLBACK_ICONS
                ]
              : method.icon?.data,
        },
      })),
    }),
  });
};
