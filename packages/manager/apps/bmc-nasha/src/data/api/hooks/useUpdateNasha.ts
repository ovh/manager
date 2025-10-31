import { useMutation, useQueryClient } from '@tanstack/react-query';
import { v6 } from '@ovh-ux/manager-core-api';
import { NASHA_BASE_API_URL } from '@/constants/Nasha.constants';

type UpdateNashaParams = {
  monitored?: boolean;
  customName?: string;
};

export function useUpdateNashaMonitored(serviceName: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ monitored }: { monitored: boolean }) => {
      const { data } = await v6.put(`${NASHA_BASE_API_URL}/${serviceName}`, { monitored });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nasha-detail', serviceName] });
    },
  });
}

export function useUpdateNashaCustomName(serviceName: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ customName }: { customName: string }) => {
      const { data } = await v6.put(`${NASHA_BASE_API_URL}/${serviceName}`, { customName });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nasha-detail', serviceName] });
    },
  });
}
