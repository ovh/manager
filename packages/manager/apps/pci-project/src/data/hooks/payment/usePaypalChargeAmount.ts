import { useMemo } from 'react';
import { CREDIT_PROVISIONING } from '@/payment/constants';
import { TCommercialOffer } from '@/data/types/payment/order-catalog.type';
import { useCreditProvisioningPlan } from './useCreditProvisioningPlan';

function getPayPalChargeAmount(
  creditProvisioningPlan: TCommercialOffer | undefined,
) {
  const uCent = 1000000; // micro cent factor -> 10^-6
  const priceInCent =
    (creditProvisioningPlan?.pricings?.find(
      ({ mode }) => mode === CREDIT_PROVISIONING.PRICE_MODE,
    )?.price ?? 0) / uCent;

  return priceInCent / 100; // To get the price in currency base
}

export const usePaypalChargeAmount = () => {
  const { data: creditProvisioningPlan, ...rest } = useCreditProvisioningPlan();

  return {
    amount: useMemo(() => getPayPalChargeAmount(creditProvisioningPlan), [
      creditProvisioningPlan,
    ]),
    data: creditProvisioningPlan,
    ...rest,
  };
};
