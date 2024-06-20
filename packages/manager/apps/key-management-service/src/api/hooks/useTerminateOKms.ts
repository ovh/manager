import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react';
import { terminateOKmsQueryKey, terminateOKms } from '../services/post';
import { getOkmsServiceId, getOkmsServiceIdQueryKey } from '../services/get';
import { getOkmsServicesResourceListQueryKey } from '../GET/apiv2/services';

export const useTerminateOKms = ({
  okmsId,
  onSuccess,
  onError,
}: {
  okmsId: string;
  onSuccess?: () => void;
  onError?: (result: ApiError) => void;
}) => {
  const [isErrorVisible, setIsErrorVisible] = React.useState(false);
  const queryClient = useQueryClient();

  const {
    mutate: terminateKms,
    isPending,
    error: terminateKmsError,
  } = useMutation({
    mutationKey: terminateOKmsQueryKey(okmsId),
    mutationFn: async () => {
      const { data: servicesId } = await queryClient.fetchQuery<
        ApiResponse<number[]>
      >({
        queryKey: getOkmsServiceIdQueryKey({ okms: okmsId }),
        queryFn: () => getOkmsServiceId({ okms: okmsId }),
      });
      return terminateOKms({ serviceId: servicesId[0] });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getOkmsServicesResourceListQueryKey,
      });
      onSuccess?.();
    },
    onError: (result: ApiError) => {
      setIsErrorVisible(true);
      onError?.(result);
    },
  });

  return {
    terminateKms,
    isPending,
    isErrorVisible: terminateKmsError && isErrorVisible,
    error: terminateKmsError,
    hideError: () => setIsErrorVisible(false),
  };
};
