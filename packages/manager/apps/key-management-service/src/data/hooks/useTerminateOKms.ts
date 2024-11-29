import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { useNotifications } from '@ovh-ux/manager-react-components';
import {
  MutationOptions,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { getOkmsServicesResourceListQueryKey } from '../api/okms';
import {
  getOkmsServiceId,
  getOkmsServiceIdQueryKey,
  terminateOKms,
  terminateOKmsQueryKey,
} from '../api/okmsService';

export type UseTerminateOkmsParams = {
  okmsId: string;
} & MutationOptions<ApiResponse<{ message: string }>, ApiError>;

export const useTerminateOKms = ({
  okmsId,
  ...options
}: UseTerminateOkmsParams) => {
  const queryClient = useQueryClient();
  const { addError, addSuccess, clearNotifications } = useNotifications();
  const { t } = useTranslation('key-management-service/terminate');

  const { mutate: terminateKms, isPending } = useMutation({
    mutationKey: terminateOKmsQueryKey(okmsId),
    mutationFn: async () => {
      const { data: servicesId } = await queryClient.fetchQuery<
        ApiResponse<number[]>
      >({
        queryKey: getOkmsServiceIdQueryKey(okmsId),
        queryFn: () => getOkmsServiceId(okmsId),
      });
      return terminateOKms({ serviceId: servicesId[0] });
    },
    onSuccess: (...params) => {
      clearNotifications();
      addSuccess(
        t('key_management_service_terminate_success_banner', {
          ServiceName: okmsId,
        }),
        true,
      );
      queryClient.invalidateQueries({
        queryKey: getOkmsServicesResourceListQueryKey,
      });
      options?.onSuccess?.(...params);
    },
    onError: (result: ApiError, ...params) => {
      clearNotifications();
      addError(
        t('key_management_service_terminate_error', {
          error: result.message,
        }),
        true,
      );
      options?.onError?.(result, ...params);
    },
    ...options,
  });

  return {
    terminateKms,
    isPending,
  };
};
