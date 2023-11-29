/* eslint-disable import/prefer-default-export */
import { useQueries, useQuery } from '@tanstack/react-query';
import {
  getVrackList,
  getVrackListQueryKey,
  getVrackAllowedServices,
  getVrackAllowedServicesQueryKey,
} from './get';

/**
 * @returns List of allowed vRack to be associated to a vRack Services
 */
export const useAllowedVrackList = (vrackServicesId?: string) => {
  const serviceFamily = 'vrackServices';
  const {
    data: vrackListResponse,
    isLoading: isVrackListLoading,
    isError: isVrackListError,
    isFetched,
  } = useQuery({
    queryKey: getVrackListQueryKey,
    queryFn: getVrackList,
  });

  const result = useQueries({
    queries:
      isFetched && vrackListResponse?.data.length > 0
        ? vrackListResponse.data.map((vrack) => ({
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
  };

  return {
    allowedVrackList:
      vrackServicesId && !resultStatus.isLoading && !resultStatus.isError
        ? result.reduce((allowedVrackList, { data }, index) => {
            if (data.data.vrackServices?.includes(vrackServicesId)) {
              return allowedVrackList.concat(vrackListResponse.data[index]);
            }
            return allowedVrackList;
          }, [] as string[])
        : [],
    ...resultStatus,
  };
};
