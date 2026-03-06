import { useContext } from 'react';

import { MutationOptions, useMutation, useQueryClient } from '@tanstack/react-query';

import { ApiError, ApiResponse } from '@ovh-ux/manager-core-api';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

import { deleteService, getResourceServiceId, getResourceServiceIdQueryKey } from '../api';

export type DeleteServiceMutationParams = {
  resourceName: string;
};

export type UseDeleteServiceParams = {
  force?: boolean;
} & MutationOptions<
  ApiResponse<{ message: string }>,
  ApiError | Error,
  DeleteServiceMutationParams
>;

export const useDeleteService = ({
  force,
  ...options
}: UseDeleteServiceParams) => {
  const queryClient = useQueryClient();
  const { ovhSubsidiary } = useContext(ShellContext)?.environment?.getUser() || {};

  const { mutate: terminateService, ...mutation } = useMutation({
    mutationFn: async ({ resourceName }) => {
      const { data } = await queryClient.fetchQuery<ApiResponse<number[]>, ApiError>({
        queryKey: getResourceServiceIdQueryKey({ resourceName }),
        queryFn: () => getResourceServiceId({ resourceName }),
      });

      if (!data?.[0]) {
        throw new Error(
          `No service found for resource ${resourceName}, cannot terminate service`,
        );
      }

      return deleteService({ serviceId: data[0], ovhSubsidiary, force });
    },
    ...options,
  });

  return {
    terminateService,
    ...mutation,
  };
};
