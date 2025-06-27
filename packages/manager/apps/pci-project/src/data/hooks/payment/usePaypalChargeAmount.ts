import { CREDIT_PROVISIONING } from '@/payment/constants';
import { TCommercialOffer } from '@/data/types/payment/order-catalog.type';
import { useCreditProvisioningPlan } from './useCreditProvisioningPlan';

function getPayPalChargeAmount(
  creditProvisioningPlan: TCommercialOffer | undefined,
): number {
  return (
    creditProvisioningPlan?.pricings?.find(
      ({ mode }) => mode === CREDIT_PROVISIONING.PRICE_MODE,
    )?.price ?? 0
  );
}

export const usePaypalChargeAmount = () => {
  return useCreditProvisioningPlan<number>(getPayPalChargeAmount);
};
