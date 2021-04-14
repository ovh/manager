import { FormattedPaymentType, PaymentTypes } from '@/models/payment';

export default function getAvailablePaymentMeans(
  allPayments: PaymentTypes,
): FormattedPaymentType[] {
  return Object.keys(allPayments)
    .map((key: string) => {
      return {
        id: key,
        isAvailable: allPayments[key],
      };
    })
    .filter((payment) => payment.isAvailable);
}
