import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 300_000,
    },
  },
});

export const resetNetworks = async (projectId: string) => {
  await queryClient.invalidateQueries({
    queryKey: ['project', projectId, 'gateway'],
  });
  await queryClient.invalidateQueries({ queryKey: ['subnet', projectId] });
  await queryClient.invalidateQueries({
    queryKey: ['aggregated-network', projectId],
  });
};

export default queryClient;
