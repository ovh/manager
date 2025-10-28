import { useMutation } from '@tanstack/react-query';

import { updateAdmissionPlugin } from '@/api/data/plugins';
import queryClient from '@/queryClient';
import { TKube } from '@/types';

import { getAllKubeQueryKey } from '../useKubernetes';

type TUseUpdateAdmissionPluginProps = {
  onError: (cause: Error) => void;
  projectId: string;
  onSuccess: () => void;
  kubeId: string;
};

export const useUpdateAdmissionPlugin = ({
  onError,
  projectId,
  onSuccess,
  kubeId,
}: TUseUpdateAdmissionPluginProps) => {
  const mutation = useMutation({
    mutationFn: (customization: TKube['customization']) =>
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
