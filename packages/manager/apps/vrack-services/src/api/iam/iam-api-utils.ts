import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ApiResponse, ApiError } from '@ovh-ux/manager-core-api';
import { getIamResourceQueryKey, getIamResource } from './get';
import { IAMResource } from './iam.type';
import { useVrackService } from '../vrack-services/vs-api-utils';
import {
  getEligibleManagedServiceListQueryKey,
  getEligibleManagedServiceList,
} from '../vrack-services/get';
import {
  EligibleManagedService,
  Subnet,
} from '../vrack-services/vrack-services.type';

export const useServiceList = (vrackServicesId: string) => {
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
  } = useQuery<ApiResponse<IAMResource[]>, ApiError>({
    queryKey: getIamResourceQueryKey(urnList),
    queryFn: () => getIamResource(urnList),
    enabled: false,
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
    setUrnList((urns) =>
      Array.from(
        new Set(
          vrackServices?.currentState.subnets
            .flatMap((subnet: Subnet) =>
              subnet.serviceEndpoints.map(
                (endpoint) => endpoint.managedServiceURN,
              ),
            )
            .concat(urns),
        ),
      ),
    );
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
  };
};
