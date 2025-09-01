import { useQuery } from "@tanstack/react-query";
import { Environment } from "@ovh-ux/manager-config";
import { useOvhPaymentMethod } from '@ovh-ux/ovh-payment-method';
import { useReket } from '@ovh-ux/ovh-reket';
import { useApplication } from "@/context";
import { IPaymentMethod } from "@/payment-modal/PaymentModal";
import { PAYMENT_ALERTS } from "@/payment-modal/PaymentModal.constants";

export const useExpiredDefaultCreditCardAlert = (enabled: boolean) => {
  const { shell } = useApplication();
  const environment: Environment = shell
    .getPlugin('environment')
    .getEnvironment();
  const region = environment.getRegion();
  const ovhPaymentMethodService = useOvhPaymentMethod({
    reketInstance: useReket(),
    region,
  });
  return useQuery({
    queryKey: ['expired-credit-card'],
    queryFn: ovhPaymentMethodService.getPaymentMethods,
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
    enabled,
  });
};
