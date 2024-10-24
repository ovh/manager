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

export const useActivateLicenseHYCUMutation = (
  options: Partial<
    UseMutationOptions<
      AxiosResponse,
      Error,
      PostLicenseHycuActivateServiceParams
    >
  > = {},
) => {
  const queryClient = useQueryClient();

  const { onSuccess, ...restOptions } = options;

  return useMutation({
    mutationKey: postActivateLicenseHycuMutationKey(),
    mutationFn: (params) => postLicenseHycuActivateService(params),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: getLicenseHycuListQueryKey() });
      queryClient.invalidateQueries({
        queryKey: getServiceDetailsQueryKey(variables.serviceName),
      });
      queryClient.invalidateQueries({
        queryKey: getLicenseHycuQueryKey(variables.serviceName),
      });

      onSuccess?.(data, variables, context);
    },
    ...(restOptions ?? {}),
  });
};
