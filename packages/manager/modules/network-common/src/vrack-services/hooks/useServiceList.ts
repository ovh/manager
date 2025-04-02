import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ApiResponse, ApiError } from '@ovh-ux/manager-core-api';
import {
  getEligibleManagedServiceList,
  getEligibleManagedServiceListQueryKey,
} from '../api';
import {
  EligibleManagedService,
  Subnet,
  VrackServicesWithIAM,
} from '../../types';
import { useVrackService } from './useVrackServices';

const addVrackServicesUrnToUrnList = (vrackServices: VrackServicesWithIAM) => (
  urns: string[],
) =>
  Array.from(
    new Set(
      vrackServices?.currentState.subnets
        .flatMap((subnet: Subnet) =>
          subnet.serviceEndpoints.map((endpoint) => endpoint.managedServiceURN),
        )
        .concat(urns),
    ),
  );

export const useServiceList = <T>(
  vrackServicesId: string,
  iamResource: {
    getIamResourceQueryKey;
    getIamResource: (urnList) => Promise<ApiResponse<T[]>>;
  },
) => {
  const [urnList, setUrnList] = React.useState<string[]>([]);
  const { data: vrackServices } = useVrackService();

  const {
    data: serviceListResponse,
    isLoading: isServiceListLoading,
    error: serviceListError,
  } = useQuery<ApiResponse<EligibleManagedService[]>, ApiError>({
    queryKey: getEligibleManagedServiceListQueryKey(vrackServicesId),
    queryFn: () => getEligibleManagedServiceList(vrackServicesId),
  });

  const {
    data: iamResources,
    isLoading: isIamResourcesLoading,
    error: iamResourcesError,
    refetch: refetchIamResources,
  } = useQuery<ApiResponse<T[]>, ApiError>({
    queryKey: iamResource.getIamResourceQueryKey(urnList),
    queryFn: () => iamResource.getIamResource(urnList),
    enabled: urnList.length > 0,
  });

  React.useEffect(() => {
    setUrnList((urns) =>
      Array.from(
        new Set(
          serviceListResponse?.data
            .flatMap((service) => service.managedServiceURNs)
            .concat(urns),
        ),
      ),
    );
  }, [serviceListResponse?.data]);

  React.useEffect(() => {
    setUrnList(addVrackServicesUrnToUrnList(vrackServices));
  }, [vrackServices?.checksum]);

  React.useEffect(() => {
    refetchIamResources();
  }, [urnList]);

  return {
    serviceListResponse,
    serviceListError,
    isServiceListLoading,
    iamResources,
    iamResourcesError,
    isIamResourcesLoading,
    refetchIamResources,
  };
};
