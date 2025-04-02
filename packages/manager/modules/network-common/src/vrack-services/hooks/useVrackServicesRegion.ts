import { useQuery } from '@tanstack/react-query';
import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import {
  getVrackServicesRegionListQueryKey,
  getVrackServicesRegionList,
} from '../api';
import { Region } from '../../types';

export const useVrackServicesRegion = () =>
  useQuery<ApiResponse<Region[]>, ApiError>({
    queryKey: getVrackServicesRegionListQueryKey,
    queryFn: getVrackServicesRegionList,
    staleTime: Infinity,
  });
