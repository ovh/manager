import { useMutation, useQueryClient } from '@tanstack/react-query';

import { TLocalisation } from '@ovh-ux/manager-pci-common';

import { addProjectRegion } from '../data/regions';

export type TUseAddProjectRegionArgs = {
  projectId: string;
  onError: (cause: Error) => void;
  onSuccess: (data: TLocalisation, variables: string, context: unknown) => void;
};

export const useQueryRegionQueryKey = (projectId: string) => ['project', projectId, 'regions'];

export const useAddProjectRegion = ({
  projectId,
  onError,
  onSuccess,
}: TUseAddProjectRegionArgs) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (region: string) => addProjectRegion(projectId, region),
    onError,
    onSuccess: async (...arg) => {
      await queryClient.invalidateQueries({
        queryKey: useQueryRegionQueryKey(projectId),
      });
      onSuccess(...arg);
    },
  });
  return {
    addRegion: mutation.mutate,
    ...mutation,
  };
};
