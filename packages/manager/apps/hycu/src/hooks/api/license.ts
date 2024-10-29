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
  getDownloadLicenseHycuMutationKey,
  getLicenseHycuDownloadService,
  GetLicenseHycuDownloadServiceParams,
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
import { downloadTextAsFile } from '@/utils/downloadTextAsFile';
import { LICENSE_FILE_NAME_TEMPLATE } from '@/constants';

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

export const useDownloadLicenseHYCUMutation = (
  options: Partial<
    UseMutationOptions<
      AxiosResponse<{ content: string }>,
      Error,
      GetLicenseHycuDownloadServiceParams
    >
  > = {},
) => {
  const { onSuccess, ...restOptions } = options;

  return useMutation({
    mutationKey: getDownloadLicenseHycuMutationKey(),
    mutationFn: (params) => getLicenseHycuDownloadService(params),
    onSuccess: (data, variables, context) => {
      downloadTextAsFile(
        LICENSE_FILE_NAME_TEMPLATE.replace(
          '{serviceName}',
          variables.serviceName,
        ),
        data.data.content,
      );

      onSuccess?.(data, variables, context);
    },
    ...(restOptions ?? {}),
  });
};
