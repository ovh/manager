import { useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiResponse, ApiError } from '@ovh-ux/manager-core-api';
import {
  getVrackServicesResourceListQueryKey,
  getVrackServicesResourceList,
  getVrackServicesResourceQueryKey,
} from '../api';
import { VrackServicesWithIAM } from '../../types';

export const useVrackServicesList = (refetchIntervalTime = 5000) => {
  const queryClient = useQueryClient();

  return useQuery<ApiResponse<VrackServicesWithIAM[]>, ApiError>({
    queryKey: getVrackServicesResourceListQueryKey,
    queryFn: async () => {
      const result = await getVrackServicesResourceList();
      result?.data.forEach((vs) => {
        queryClient.setQueryData(getVrackServicesResourceQueryKey(vs.id), vs);
      });
      return result;
    },
    refetchInterval: (query) =>
      query.state.data?.data?.some((vs) =>
        vs?.currentTasks?.some((task) =>
          ['RUNNING', 'PENDING'].includes(task.status),
        ),
      )
        ? refetchIntervalTime
        : undefined,
  });
};
