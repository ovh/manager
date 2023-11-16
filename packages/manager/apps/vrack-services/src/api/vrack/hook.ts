/* eslint-disable import/prefer-default-export */
import { useQueries, useQuery } from '@tanstack/react-query';
import {
  getVrackList,
  getVrackListQueryKey,
  getVrackServiceAllowedServices,
  getVrackServiceAllowedServicesQueryKey,
} from './get';

export const useVrackServicesAllowedVrack = (vrackServicesId?: string) => {
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
        ? vrackListResponse.data.map((serviceName) => ({
            queryKey: getVrackServiceAllowedServicesQueryKey({
              serviceName,
              serviceFamily,
            }),
            queryFn: () =>
              getVrackServiceAllowedServices({
                serviceName,
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
            if (data.data.vrackServices.includes(vrackServicesId)) {
              return allowedVrackList.concat(vrackListResponse.data[index]);
            }
            return allowedVrackList;
          }, [] as string[])
        : [],
    ...resultStatus,
  };
};
