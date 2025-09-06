import { useParams } from 'react-router-dom';

import { useQuery, useQueryClient } from '@tanstack/react-query';

import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';

import { VrackServices, VrackServicesWithIAM } from '../../types';
import {
  getVrackServicesResource,
  getVrackServicesResourceListQueryKey,
  getVrackServicesResourceQueryKey,
} from '../api';

/**
 * Query the current vRack Services and poll it if it is not ready
 */
export const useVrackService = (refetchIntervalTime = 2000) => {
  const { id } = useParams();
  const queryClient = useQueryClient();

  return useQuery<VrackServicesWithIAM, ApiError, VrackServicesWithIAM, string[]>({
    queryKey: getVrackServicesResourceQueryKey(`${id}`),
    queryFn: async () => {
      const response = await getVrackServicesResource(`${id}`);
      queryClient.setQueryData(
        getVrackServicesResourceListQueryKey,
        ({ data: listingData, ...rest }: ApiResponse<VrackServices[]>) => ({
          data: listingData.map((vrackServices) =>
            vrackServices.id === response?.data?.id ? response.data : vrackServices,
          ),
          ...rest,
        }),
      );
      return response.data;
    },
    refetchInterval: (query) =>
      query.state.data?.currentTasks?.some((task) => ['RUNNING', 'PENDING'].includes(task.status))
        ? refetchIntervalTime
        : undefined,
  });
};
