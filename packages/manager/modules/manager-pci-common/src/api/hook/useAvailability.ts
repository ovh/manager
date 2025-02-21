import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useMe } from '@ovh-ux/manager-react-components';
import {
  getProductAvailability,
  ProductAvailabilityFilter,
} from '../data/availability';

const getProductAvailabilityQueryKey = ({
  projectId,
  ovhSubsidiary,
  filter,
}: {
  projectId: string;
  ovhSubsidiary: string;
  filter?: ProductAvailabilityFilter;
}) => ['product-availability', projectId, ovhSubsidiary, filter];

export const getProductAvailabilityQuery = (
  projectId: string,
  ovhSubsidiary: string,
  filter?: ProductAvailabilityFilter,
) => ({
  queryKey: getProductAvailabilityQueryKey({
    projectId,
    ovhSubsidiary,
    filter,
  }),
  queryFn: () =>
    getProductAvailability(projectId, {
      ovhSubsidiary,
      ...filter,
    }),
});

export const useProductAvailability = (
  projectId: string,
  filter?: ProductAvailabilityFilter,
) => {
  const { me } = useMe();
  return useQuery({
    ...getProductAvailabilityQuery(projectId, me?.ovhSubsidiary, filter),
    enabled: !!me,
  });
};

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
