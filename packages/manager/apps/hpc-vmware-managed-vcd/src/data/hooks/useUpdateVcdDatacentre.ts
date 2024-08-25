import { ApiError } from '@ovh-ux/manager-core-api';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useState } from 'react';
import {
  UpdateVdcDetailsParams,
  updateVdcDetails,
} from '../api/hpc-vmware-managed-vcd-datacentre';

const updateVdcDetailsQueryKey = ({
  id,
  vdcId,
}: Pick<UpdateVdcDetailsParams, 'id' | 'vdcId'>) => [
  `put/vmwareCloudDirector/organization/${id}/virtualDataCenter/${vdcId}`,
];

export const useUpdateVdcDetails = ({
  id,
  vdcId,
  onSuccess,
  onError,
}: {
  id: string;
  vdcId: string;
  onSuccess?: () => void;
  onError?: (result: ApiError) => void;
}) => {
  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const queryClient = useQueryClient();

  const { mutateAsync: updateDetails, error } = useMutation({
    mutationKey: updateVdcDetailsQueryKey({ id, vdcId }),
    mutationFn: ({ details }: UpdateVdcDetailsParams) =>
      updateVdcDetails({ id, vdcId, details }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [],
      });
      onSuccess?.();
    },
    onError: (result: ApiError) => {
      setIsErrorVisible(true);
      onError?.(result);
    },
  });

  return {
    updateDetails,
    error,
    isErrorVisible,
    hideError: () => setIsErrorVisible(false),
  };
};
