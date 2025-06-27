import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { CREDIT_PROVISIONING } from '@/payment/constants';
import { getOrderCatalog } from '@/data/api/payment/order-catalog';
import { TCommercialOffer } from '@/data/types/payment/order-catalog.type';

export const creditProvisioningPlanQueryKey = (ovhSubsidiary: string) => [
  'order',
  'catalog',
  'public',
  'cloud',
  ['subsidiary', ovhSubsidiary],
  ['creditProvisioningPlan', CREDIT_PROVISIONING.PLAN_CODE],
];

export const useCreditProvisioningPlan = <T>(
  selectFunc: (creditProvisioningPlan: TCommercialOffer | undefined) => T,
) => {
  const { environment } = useContext(ShellContext);
  const { ovhSubsidiary } = environment?.getUser();

  return useQuery({
    queryKey: creditProvisioningPlanQueryKey(ovhSubsidiary),
    queryFn: () =>
      getOrderCatalog({
        ovhSubsidiary,
      }),
    select: (data) =>
      selectFunc(
        data?.plans.find(
          (plan) => plan.planCode === CREDIT_PROVISIONING.PLAN_CODE,
        ),
      ),
  });
};
