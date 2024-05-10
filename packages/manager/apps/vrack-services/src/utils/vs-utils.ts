import React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { ApiResponse, ApiError } from '@ovh-ux/manager-core-api';
import {
  getVrackServicesResourceListQueryKey,
  getVrackServicesResource,
  getVrackServicesResourceQueryKey,
  ResourceStatus,
  VrackServices,
  UpdateVrackServicesParams,
  updateVrackServicesQueryKey,
  updateVrackServices,
  ProductStatus,
  VrackServicesWithIAM,
  getVrackServicesResourceList,
  getIamResourceQueryKey,
  getIamResource,
  IAMResource,
  getEligibleManagedServiceListQueryKey,
  getEligibleManagedServiceList,
  EligibleManagedService,
} from '@/api';

export const useVrackServicesList = (refetchInterval = 30000) =>
  useQuery<ApiResponse<VrackServicesWithIAM[]>, ApiError>({
    queryKey: getVrackServicesResourceListQueryKey,
    queryFn: () => getVrackServicesResourceList(),
    refetchInterval,
  });

/**
 * Query the current vRack Services and poll it if it is not ready
 */
export const useVrackService = (refetchInterval = 30000) => {
  const { id } = useParams();
  const queryClient = useQueryClient();

  return useQuery<
    VrackServicesWithIAM,
    ApiError,
    VrackServicesWithIAM,
    string[]
  >({
    queryKey: getVrackServicesResourceQueryKey(id),
    queryFn: async () => {
      const response = await getVrackServicesResource(id);
      queryClient.setQueryData(
        getVrackServicesResourceListQueryKey,
        ({ data: listingData, ...rest }: ApiResponse<VrackServices[]>) => ({
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

export const isEditable = (vs?: VrackServices) =>
  vs?.resourceStatus === ResourceStatus.READY &&
  [ProductStatus.ACTIVE, ProductStatus.DRAFT].includes(
    vs?.currentState.productStatus,
  );

export const hasSubnet = (vs?: VrackServices) =>
  vs?.currentState.subnets.length > 0;

/**
 * Get the function to mutate a vRack Services
 */
export const useUpdateVrackServices = ({
  key,
  onSuccess,
  onError,
  updateTriggerDelay = 5000,
}: {
  key: string;
  onSuccess?: (result: ApiResponse<VrackServices>) => void;
  onError?: (result: ApiError) => void;
  updateTriggerDelay?: number;
}) => {
  const [isErrorVisible, setIsErrorVisible] = React.useState(false);
  const queryClient = useQueryClient();

  const { mutateAsync: updateVS, isPending, error: updateError } = useMutation<
    ApiResponse<VrackServices>,
    ApiError,
    UpdateVrackServicesParams
  >({
    mutationKey: updateVrackServicesQueryKey(key),
    mutationFn: updateVrackServices,
    onSettled: (result) => {
      queryClient.invalidateQueries({
        queryKey: getVrackServicesResourceListQueryKey,
      });
      if (result) {
        queryClient.invalidateQueries({
          queryKey: getVrackServicesResourceQueryKey(result.data?.id || key),
        });
      }
    },
    onSuccess: (result: ApiResponse<VrackServices>) => {
      queryClient.setQueryData(
        getVrackServicesResourceListQueryKey,
        ({ data: listingData, ...rest }: ApiResponse<VrackServices[]>) => ({
          data: listingData.map((vrackServices) =>
            vrackServices.id === result.data.id ? result.data : vrackServices,
          ),
          ...rest,
        }),
      );
      queryClient.setQueryData(
        getVrackServicesResourceQueryKey(result.data.id),
        (response: ApiResponse<VrackServices>) => ({
          ...response,
          data: result.data,
        }),
      );
      // Triggers an update in 5seconds for fast operations
      setTimeout(() => {
        queryClient.refetchQueries({
          queryKey: getVrackServicesResourceListQueryKey,
          exact: true,
        });
        queryClient.refetchQueries({
          queryKey: getVrackServicesResourceQueryKey(result.data.id),
          exact: true,
        });
      }, updateTriggerDelay);
      onSuccess?.(result);
    },
    onError: (result) => {
      setIsErrorVisible(true);
      onError?.(result);
    },
  });

  return {
    updateVS,
    isPending,
    isErrorVisible: updateError && isErrorVisible,
    hideError: () => setIsErrorVisible(false),
    updateError,
  };
};

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
            .flatMap((subnet) =>
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
