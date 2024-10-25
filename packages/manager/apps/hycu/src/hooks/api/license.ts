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
  getlicenseHycuListQueryKey,
  getlicenseHycuQueryKey,
  getlicenseHycuService,
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
    queryKey: getlicenseHycuQueryKey(serviceName),
    queryFn: () => getlicenseHycuService({ serviceName }),
    ...(options ?? {}),
  });
};

export const useInvalidateCacheForALicenseHycu = () => {
  const queryClient = useQueryClient();

  return (serviceName: string) => {
    queryClient.invalidateQueries({ queryKey: getlicenseHycuListQueryKey() });
    queryClient.invalidateQueries({
      queryKey: getServiceDetailsQueryKey(serviceName),
    });
    queryClient.invalidateQueries({
      queryKey: getlicenseHycuQueryKey(serviceName),
    });
  };
};

// https://eu.api.ovh.com/console/?section=%2Flicense%2Fhycu&branch=v1#post-/license/hycu/-serviceName-/activate
// urn : licenseHycu:apiovh:activate
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

// https://eu.api.ovh.com/console/?section=%2Flicense%2Fhycu&branch=v1#post-/license/hycu/-serviceName-/activate
// urn : licenseHycu:apiovh:activate
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
