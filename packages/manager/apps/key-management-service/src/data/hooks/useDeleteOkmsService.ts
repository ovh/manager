import { ApiResponse } from '@ovh-ux/manager-core-api';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { useContext } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import {
  deleteService,
  DeleteServiceResponse,
  getOkmsServiceId,
} from '../api/okmsService';

export type DeleteOkmsServiceMutationParams = {
  resourceName: string;
};

export const deleteOkmsServiceMutationKey = ['delete-okms-service'];

export const useDeleteOkmsService = (
  options: Partial<
    UseMutationOptions<
      ApiResponse<DeleteServiceResponse>,
      Error,
      DeleteOkmsServiceMutationParams
    >
  >,
) => {
  const { ovhSubsidiary } = useContext(ShellContext).environment.getUser();

  return useMutation({
    mutationKey: deleteOkmsServiceMutationKey,
    mutationFn: async ({ resourceName }: DeleteOkmsServiceMutationParams) => {
      const { data } = await getOkmsServiceId(resourceName);

      return deleteService(data[0], ovhSubsidiary);
    },
    ...(options ?? {}),
  });
};
