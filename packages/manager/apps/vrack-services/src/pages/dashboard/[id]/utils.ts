/* eslint-disable import/prefer-default-export */
import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import {
  getVrackServicesResourceListQueryKey,
  getVrackServicesResource,
  getVrackServicesResourceQueryKey,
  ResourceStatus,
  ResponseData,
  VrackServices,
} from '@/api';

/**
 * Query the current vRack Services and poll it if it is not ready
 */
export const useVrackService = (pollingInterval = 30000) => {
  const [refetchInterval, setRefetchInterval] = React.useState(0);
  const { id } = useParams();
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: getVrackServicesResourceQueryKey(id),
    queryFn: async () => {
      const response = await getVrackServicesResource(id);
      const interval =
        response.data.resourceStatus !== ResourceStatus.READY
          ? pollingInterval
          : 0;

      setRefetchInterval(interval);

      queryClient.setQueryData(
        getVrackServicesResourceListQueryKey,
        ({ data: listingData, ...rest }: ResponseData<VrackServices[]>) => ({
          data: listingData.map((vrackServices) =>
            vrackServices.id === response.data.id
              ? response.data
              : vrackServices,
          ),
          ...rest,
        }),
      );

      return response.data;
    },
    refetchInterval,
  });
};
