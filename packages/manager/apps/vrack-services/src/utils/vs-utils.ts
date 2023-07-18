import React from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import {
  getVrackServicesResourceListQueryKey,
  getVrackServicesResource,
  getVrackServicesResourceQueryKey,
  ResourceStatus,
  ResponseData,
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
  useQuery<ResponseData<VrackServicesWithIAM[]>, ResponseData<Error>>({
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
    ResponseData<Error>,
    VrackServicesWithIAM,
    string[]
  >({
    queryKey: getVrackServicesResourceQueryKey(id),
    queryFn: async () => {
      const response = await getVrackServicesResource(id);
      queryClient.setQueryData(
        getVrackServicesResourceListQueryKey,
        ({ data: listingData, ...rest }: ResponseData<VrackServices[]>) => ({
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
}: {
  key: string;
  onSuccess?: (result: ResponseData<VrackServices>) => void;
}) => {
  const [isErrorVisible, setErrorVisible] = React.useState(false);
  const queryClient = useQueryClient();

  const {
    mutateAsync: updateVS,
    isPending,
    isError,
    error: updateError,
  } = useMutation<
    ResponseData<VrackServices>,
    ResponseData<Error>,
    UpdateVrackServicesParams
  >({
    mutationKey: updateVrackServicesQueryKey(key),
    mutationFn: updateVrackServices,
    onSuccess: (result: ResponseData<VrackServices>) => {
      queryClient.setQueryData(
        getVrackServicesResourceListQueryKey,
        ({ data: listingData, ...rest }: ResponseData<VrackServices[]>) => ({
          data: listingData.map((vrackServices) =>
            vrackServices.id === result.data.id ? result.data : vrackServices,
          ),
          ...rest,
        }),
      );
      queryClient.setQueryData(
        getVrackServicesResourceQueryKey(key),
        (response: ResponseData<VrackServices>) => ({
          ...response,
          data: result.data,
        }),
      );
      onSuccess?.(result);
    },
  });

  React.useEffect(() => {
    if (isError) {
      setErrorVisible(true);
    }
  }, [isError]);

  return {
    updateVS,
    isPending,
    isErrorVisible,
    hideError: () => setErrorVisible(false),
    updateError,
  };
};

export const useServiceList = (vrackServicesId: string) => {
  const [urnList, setUrnList] = React.useState<string[]>([]);

  const {
    data: serviceListResponse,
    isLoading: isServiceListLoading,
    error: serviceListError,
  } = useQuery<ResponseData<EligibleManagedService[]>, ResponseData<Error>>({
    queryKey: getEligibleManagedServiceListQueryKey(vrackServicesId),
    queryFn: () => getEligibleManagedServiceList(vrackServicesId),
    staleTime: Infinity,
  });

  const {
    data: iamResources,
    isLoading: isIamResourcesLoading,
    error: iamResourcesError,
  } = useQuery<ResponseData<IAMResource[]>, ResponseData<Error>>({
    queryKey: getIamResourceQueryKey(urnList),
    queryFn: () => getIamResource(urnList),
    enabled: urnList.length > 0,
  });

  React.useEffect(() => {
    setUrnList(
      Array.from(
        new Set(
          serviceListResponse?.data.flatMap(
            (service) => service.managedServiceURNs,
          ),
        ),
      ),
    );
  }, [serviceListResponse?.data]);

  return {
    serviceListResponse,
    serviceListError,
    isServiceListLoading,
    iamResources,
    iamResourcesError,
    isIamResourcesLoading,
  };
};
