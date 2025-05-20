import { useQueryClient } from '@tanstack/react-query';

export type ProductAvailabilityFilter = {
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
  filter?: ProductAvailabilityFilter;
}) => ['product-availability', projectId, ovhSubsidiary, filter];

export const useRefreshProductAvailability = (
  projectId: string,
  ovhSubsidiary: string,
  filter?: ProductAvailabilityFilter,
) => {
  const queryClient = useQueryClient();
  return {
    refresh: () =>
      queryClient.invalidateQueries({
        queryKey: getProductAvailabilityQueryKey({
          projectId,
          ovhSubsidiary,
          filter,
        }),
      }),
  };
};
