import { fetchIcebergV6 } from '@ovh-ux/manager-core-api';
import { ModalToDisplayConfiguration } from '@/types/modal-configuration.type';
import PaymentModal, { IPaymentMethod } from '@/payment-modal/PaymentModal';

export const PAYMENT_ALERTS = {
  EXPIRED_CARD: 'expired',
  SOON_EXPIRED_CARD: 'soon_expired',
};

export const PaymentModalConfiguration: ModalToDisplayConfiguration = {
  checks: {},
  data: {
    queryParams: {
      queryKey: ['me-payment-method'],
      queryFn: async () => {
        const { data } = await fetchIcebergV6<IPaymentMethod>({
          route: '/me/payment/method',
        });
        return data;
      },
      select: (data: IPaymentMethod[]) => {
        const currentCreditCard: IPaymentMethod = data.find(
          (currentPaymentMethod) =>
            currentPaymentMethod.paymentType === 'CREDIT_CARD' &&
            currentPaymentMethod.default,
        );

        if (currentCreditCard?.expirationDate) {
          const creditCardExpirationDate = new Date(
            currentCreditCard.expirationDate,
          );
          if (creditCardExpirationDate.getTime() < Date.now()) {
            return PAYMENT_ALERTS.EXPIRED_CARD;
          }
          const expirationDateMinus30Days = new Date(creditCardExpirationDate);
          expirationDateMinus30Days.setDate(
            creditCardExpirationDate.getDate() - 30,
          );
          const isSoonToBeExpireCreditCard =
            expirationDateMinus30Days.getTime() < Date.now();
          if (isSoonToBeExpireCreditCard) {
            return PAYMENT_ALERTS.SOON_EXPIRED_CARD;
          }
        }
        return null;
      },
    },
    check: (data: string | null) => {
      return data !== null;
    },
  },
  component: PaymentModal,
};
