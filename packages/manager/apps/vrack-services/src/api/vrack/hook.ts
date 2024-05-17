/* eslint-disable import/prefer-default-export */
import { UseQueryOptions, useQueries, useQuery } from '@tanstack/react-query';
import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import {
  getVrackList,
  getVrackListQueryKey,
  getVrackAllowedServices,
  getVrackAllowedServicesQueryKey,
} from './get';
import { AllowedServicesResponse } from '../api.type';

export const useVrackList = () => {
  const { data: vrackListResponse, isLoading, isError, error } = useQuery<
    ApiResponse<string[]>,
    ApiError
  >({
    queryKey: getVrackListQueryKey,
    queryFn: getVrackList,
  });

  return { vrackList: vrackListResponse?.data, isLoading, isError, error };
};
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
    enabled: !!vrackServicesId,
  });

  const result = useQueries({
    queries:
      isFetched && vrackListResponse?.data && vrackListResponse.data.length > 0
        ? vrackListResponse?.data.map(
            (vrack): UseQueryOptions => ({
              queryKey: getVrackAllowedServicesQueryKey({
                vrack,
                serviceFamily,
              }),
              queryFn: () =>
                getVrackAllowedServices({
                  vrack,
                  serviceFamily,
                }),
            }),
          )
        : [],
  });

  const resultStatus = {
    isLoading: isVrackListLoading || result.some(({ isLoading }) => isLoading),
    isError: isVrackListError,
    error: vrackListError,
    vrackListInError: result
      .map(({ isError }, index) =>
        isError ? vrackListResponse?.data?.[index] : null,
      )
      .filter(Boolean),
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
