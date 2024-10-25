import { AxiosResponse } from 'axios';
import {
  DefinedInitialDataOptions,
  UseMutationOptions,
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { getServiceDetailsQueryKey } from '@ovh-ux/manager-react-components';
import {
  getLicenseHycuListQueryKey,
  getLicenseHycuQueryKey,
  getLicenseHycuService,
  postActivateLicenseHycuMutationKey,
  postLicenseHycuActivateService,
  PostLicenseHycuActivateServiceParams,
  postLicenseHycuRegenerateService,
  postRegenerateLicenseHycuMutationKey,
} from '@/data/api/hycu';
import { IHycuDetails } from '@/types/hycu.details.interface';

export const useDetailsLicenseHYCU = (
  serviceName: string,
  options?: Partial<DefinedInitialDataOptions<AxiosResponse<IHycuDetails>>>,
) => {
  return useQuery({
    queryKey: getLicenseHycuQueryKey(serviceName),
    queryFn: () => getLicenseHycuService({ serviceName }),
    ...(options ?? {}),
  });
};

export const useInvalidateCacheForALicenseHycu = () => {
  const queryClient = useQueryClient();

  return (serviceName: string) => {
    queryClient.invalidateQueries({ queryKey: getLicenseHycuListQueryKey() });
    queryClient.invalidateQueries({
      queryKey: getServiceDetailsQueryKey(serviceName),
    });
    queryClient.invalidateQueries({
      queryKey: getLicenseHycuQueryKey(serviceName),
    });
  };
};

export const useActivateLicenseHYCUMutation = (
  options: Partial<
    UseMutationOptions<
      AxiosResponse,
      Error,
      PostLicenseHycuActivateServiceParams
    >
  > = {},
) => {
  const invalidateCacheForService = useInvalidateCacheForALicenseHycu();

  const { onSuccess, ...restOptions } = options;

  return useMutation({
    mutationKey: postActivateLicenseHycuMutationKey(),
    mutationFn: (params) => postLicenseHycuActivateService(params),
    onSuccess: (data, variables, context) => {
      invalidateCacheForService(variables.serviceName);
      onSuccess?.(data, variables, context);
    },
    ...(restOptions ?? {}),
  });
};

export const useRegenerateLicenseHYCUMutation = (
  options: Partial<
    UseMutationOptions<
      AxiosResponse,
      Error,
      PostLicenseHycuActivateServiceParams
    >
  > = {},
) => {
  const invalidateCacheForService = useInvalidateCacheForALicenseHycu();
  const { onSuccess, ...restOptions } = options;

  return useMutation({
    mutationKey: postRegenerateLicenseHycuMutationKey(),
    mutationFn: (params) => postLicenseHycuRegenerateService(params),
    onSuccess: (data, variables, context) => {
      invalidateCacheForService(variables.serviceName);
      onSuccess?.(data, variables, context);
    },
    ...(restOptions ?? {}),
  });
};
