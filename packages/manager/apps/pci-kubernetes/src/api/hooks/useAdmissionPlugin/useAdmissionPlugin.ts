import { useMutation } from '@tanstack/react-query';
import queryClient from '@/queryClient';
import { getAllKubeQueryKey } from '../useKubernetes';

import { updateAdmissionPlugin } from '@/api/data/plugins';
import { TKube } from '@/types';

export const useUpdateAdmissionPlugin = ({
  onError,
  projectId,
  onSuccess,
  kubeId,
}) => {
  const mutation = useMutation({
    mutationFn: async (customization: TKube['customization']) =>
      updateAdmissionPlugin({ projectId, kubeId, customization }),
    onError,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: getAllKubeQueryKey(projectId),
      });
      onSuccess();
    },
  });
  return {
    updateAdmissionPlugins: mutation.mutate,
    ...mutation,
  };
};
