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
} from '@/api';
import { ApiError } from '@/components/Error';

/**
 * Query the current vRack Services and poll it if it is not ready
 */
export const useVrackService = (pollingInterval = 30000) => {
  const [refetchInterval, setRefetchInterval] = React.useState(0);
  const { id } = useParams();
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: getVrackServicesResourceQueryKey(id),
    queryFn: async () => {
      const response = await getVrackServicesResource(id);
      const interval =
        response.data.resourceStatus !== ResourceStatus.READY
          ? pollingInterval
          : 0;

      setRefetchInterval(interval);

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

/**
 * Get the function to mutate a vRack Services
 */
export const useUpdateVrackServices = (key: string) => {
  const [isErrorVisible, setErrorVisible] = React.useState(false);
  const queryClient = useQueryClient();

  const { mutateAsync: updateVS, isPending, isError } = useMutation<
    ResponseData<VrackServices>,
    ResponseData<ApiError>,
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
  };
};
