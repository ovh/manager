/* eslint-disable import/prefer-default-export */
import { useQueries, useQuery } from '@tanstack/react-query';
import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import {
  getVrackList,
  getVrackListQueryKey,
  getVrackAllowedServices,
  getVrackAllowedServicesQueryKey,
} from './get';
import { AllowedServicesResponse } from '../api.type';

/**
 * @returns List of allowed vRack to be associated to a vRack Services
 */
export const useAllowedVrackList = (vrackServicesId?: string) => {
  const serviceFamily = 'vrackServices';
  const {
    data: vrackListResponse,
    isLoading: isVrackListLoading,
    isError: isVrackListError,
    error: vrackListError,
    isFetched,
  } = useQuery<ApiResponse<string[]>, ApiError>({
    queryKey: getVrackListQueryKey,
    queryFn: getVrackList,
  });

  const result = useQueries({
    queries:
      isFetched && vrackListResponse?.data && vrackListResponse.data.length > 0
        ? vrackListResponse?.data.map((vrack) => ({
            queryKey: getVrackAllowedServicesQueryKey({
              vrack,
              serviceFamily,
            }),
            queryFn: () =>
              getVrackAllowedServices({
                vrack,
                serviceFamily,
              }),
          }))
        : [],
  });

  const resultStatus = {
    isLoading: isVrackListLoading || result.some(({ isLoading }) => isLoading),
    isError: isVrackListError || result.some(({ isError }) => isError),
    error:
      vrackListError ||
      ((result.find(({ error }) => error) as unknown) as ApiError),
  };

  return {
    allowedVrackList:
      vrackServicesId && !resultStatus.isLoading && !resultStatus.isError
        ? result.reduce((allowedVrackList, { data }, index) => {
            if (
              (data as {
                data: AllowedServicesResponse;
              })?.data.vrackServices?.includes(vrackServicesId)
            ) {
              return allowedVrackList.concat(vrackListResponse?.data[index]);
            }
            return allowedVrackList;
          }, [] as string[])
        : [],
    ...resultStatus,
  };
};
