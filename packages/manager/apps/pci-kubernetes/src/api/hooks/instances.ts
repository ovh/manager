import { useMutation, useQuery } from '@tanstack/react-query';

import { getInstances } from '@ovh-ux/manager-pci-common';

import { switchToMonthlyBilling } from '@/api/data/instance';

export const useInstances = (projectId: string) =>
  useQuery({
    queryKey: ['project', projectId, 'instances'],
    queryFn: () => getInstances(projectId),
    enabled: !!projectId,
    throwOnError: true,
  });

type SwitchToMonthlyBillingProps = {
  projectId: string;
  instanceId: string;
  onError: (cause: Error) => void;
  onSuccess: () => void;
};

export const useSwitchToMonthlyBilling = ({
  projectId,
  instanceId,
  onError,
  onSuccess,
}: SwitchToMonthlyBillingProps) => {
  const mutation = useMutation({
    mutationFn: async () => switchToMonthlyBilling(projectId, instanceId),
    onError: (cause: Error) => {
      onError(cause);
    },
    onSuccess: async () => {
      onSuccess();
    },
  });

  return {
    switchToMonthlyBilling: () => mutation.mutate(),
    ...mutation,
  };
};
