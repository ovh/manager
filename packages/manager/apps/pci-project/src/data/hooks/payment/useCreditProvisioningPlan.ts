import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { CREDIT_PROVISIONING } from '@/payment/constants';
import { getOrderCatalog } from '@/data/api/payment/order-catalog';

export const creditProvisioningPlanQueryKey = () => [
  'order',
  'catalog',
  'public',
  'cloud',
  ['subsidiary', 'ovhSubsidiary'],
  ['creditProvisioningPlan', CREDIT_PROVISIONING.PLAN_CODE],
];

export const useCreditProvisioningPlan = () => {
  const { environment } = useContext(ShellContext);
  const { ovhSubsidiary } = environment?.getUser();

  return useQuery({
    queryKey: creditProvisioningPlanQueryKey(),
    queryFn: () =>
      getOrderCatalog({
        ovhSubsidiary,
      }),
    select: ({ data }) =>
      data.plans.find(
        (plan) => plan.planCode === CREDIT_PROVISIONING.PLAN_CODE,
      ),
  });
};
