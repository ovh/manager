import { useQueryClient } from '@tanstack/react-query';

import { TProductAvailability } from '@ovh-ux/manager-pci-common';

export type TProductAvailabilityFilter = {
  addonFamily?: string;
  planCode?: string;
  planFamily?: string;
  product?: string;
};

const getProductAvailabilityQueryKey = ({
  projectId,
  ovhSubsidiary,
  filter,
}: {
  projectId: string;
  ovhSubsidiary: string;
  filter?: TProductAvailabilityFilter;
}) => ['product-availability', projectId, ovhSubsidiary, filter];

export const useRefreshProductAvailability = (
  projectId: string,
  ovhSubsidiary: string,
  filter?: TProductAvailabilityFilter,
) => {
  const queryClient = useQueryClient();
  const queryKey = getProductAvailabilityQueryKey({
    projectId,
    ovhSubsidiary,
    filter,
  });
  return {
    refresh: async (): Promise<TProductAvailability | undefined> => {
      await queryClient.invalidateQueries({ queryKey });
      return queryClient.getQueryData<TProductAvailability>(queryKey);
    },
  };
};
