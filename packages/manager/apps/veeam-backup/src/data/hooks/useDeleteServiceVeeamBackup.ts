import { ApiResponse } from '@ovh-ux/manager-core-api';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { useContext } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { getResourceServiceId } from '@ovh-ux/manager-react-components';
import {
  deleteService,
  DeleteServiceResponse,
} from '../api/service-veeam-backup';

export type DeleteServiceMutationParams = {
  resourceName: string;
};

export const deleteVeeamBackupServiceMutationKey = [
  'delete-veeam-backup-service',
];

export const useDeleteVeeamBackupService = (
  options: Partial<
    UseMutationOptions<
      ApiResponse<DeleteServiceResponse>,
      Error,
      DeleteServiceMutationParams
    >
  >,
) => {
  const { ovhSubsidiary } = useContext(ShellContext).environment.getUser();

  return useMutation({
    mutationKey: deleteVeeamBackupServiceMutationKey,
    mutationFn: async ({ resourceName }: DeleteServiceMutationParams) => {
      const { data } = await getResourceServiceId({ resourceName });
      return deleteService(data[0], ovhSubsidiary);
    },
    ...(options ?? {}),
  });
};
