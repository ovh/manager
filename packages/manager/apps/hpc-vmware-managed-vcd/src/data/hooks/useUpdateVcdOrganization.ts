import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useState } from 'react';
import {
  getVcdProjectListQueryKey,
  updateVcdOrganizationDetails,
  UpdateVcdOrganizationDetailsParams,
} from '../api/hpc-vmware-managed-vcd';

const updateVcdOrganizationDetailsQueryKey = (id: string) => [
  `put/vmwareCloudDirector/organization/${id}`,
];

export const useUpdateVcdOrganizationDetails = ({
  id,
  onSuccess,
  onError,
}: {
  id: string;
  onSuccess?: () => void;
  onError?: (result: ApiError) => void;
}) => {
  const [isErrorVisible, setIsErrorVisible] = useState(false);
  const queryClient = useQueryClient();

  const { mutateAsync: updateDetails, error } = useMutation({
    mutationKey: updateVcdOrganizationDetailsQueryKey(id),
    mutationFn: ({ details }: UpdateVcdOrganizationDetailsParams) =>
      updateVcdOrganizationDetails({ id, details }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: getVcdProjectListQueryKey,
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
    isErrorVisible: isErrorVisible && error,
    hideError: () => setIsErrorVisible(false),
  };
};
