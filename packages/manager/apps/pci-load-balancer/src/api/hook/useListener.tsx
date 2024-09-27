import { useMutation, useQuery } from '@tanstack/react-query';
import { deleteListener, getListener } from '@/api/data/listener';
import queryClient from '@/queryClient';

export const useListener = ({
  projectId,
  region,
  loadBalancerId,
  listenerId,
}: {
  projectId: string;
  region: string;
  loadBalancerId: string;
  listenerId: string;
}) =>
  useQuery({
    queryKey: [
      'project',
      projectId,
      'region',
      region,
      'loadbalancer',
      loadBalancerId,
      'listeners',
      listenerId,
    ],
    queryFn: () => getListener(projectId, region, listenerId),
    throwOnError: true,
  });

type DeleteListenerProps = {
  projectId: string;
  loadBalancerId: string;
  listenerId: string;
  region: string;
  onError: (cause: Error) => void;
  onSuccess: () => void;
};

export const useDeleteListener = ({
  projectId,
  loadBalancerId,
  listenerId,
  region,
  onError,
  onSuccess,
}: DeleteListenerProps) => {
  const mutation = useMutation({
    mutationFn: async () => deleteListener(projectId, region, listenerId),
    onError,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [
          'project',
          projectId,
          'region',
          region,
          'loadbalancer',
          loadBalancerId,
          'listeners',
        ],
      });
      onSuccess();
    },
  });
  return {
    deleteListener: () => mutation.mutate(),
    ...mutation,
  };
};
