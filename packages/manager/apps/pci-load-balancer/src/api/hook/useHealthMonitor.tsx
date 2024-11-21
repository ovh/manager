import { useMutation, useQuery } from '@tanstack/react-query';
import {
  createHealthMonitor,
  deleteHealthMonitor,
  editHealthMonitor,
  getHealthMonitor,
  renameHealthMonitor,
  THealthMonitorFormState,
} from '../data/health-monitor';
import queryClient from '@/queryClient';

export const useGetHealthMonitor = ({
  projectId,
  region,
  poolId,
}: {
  projectId: string;
  region: string;
  poolId: string;
}) =>
  useQuery({
    queryKey: ['health-monitor', projectId, region, poolId],
    queryFn: () => getHealthMonitor(projectId, region, poolId),
    select: (data) => data[0],
    throwOnError: true,
  });

type DeleteHealthMonitorProps = {
  projectId: string;
  region: string;
  onError: (cause: Error) => void;
  onSuccess: () => void;
};

export const useDeleteHealthMonitor = ({
  projectId,
  region,
  onError,
  onSuccess,
}: DeleteHealthMonitorProps) => {
  const mutation = useMutation({
    mutationFn: async (healthMonitorId: string) =>
      deleteHealthMonitor(projectId, region, healthMonitorId),
    onError,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['health-monitor', projectId, region],
      });
      onSuccess();
    },
  });
  return {
    deleteHealthMonitor: (healthMonitorId: string) =>
      mutation.mutate(healthMonitorId),
    ...mutation,
  };
};

type CreateHealthMonitorProps = {
  projectId: string;
  region: string;
  poolId: string;
  onError: (cause: Error) => void;
  onSuccess: () => void;
};

export const useCreateHealthMonitor = ({
  projectId,
  region,
  poolId,
  onError,
  onSuccess,
}: CreateHealthMonitorProps) => {
  const mutation = useMutation({
    mutationFn: async (model: THealthMonitorFormState) =>
      createHealthMonitor(projectId, region, poolId, model),
    onError,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['health-monitor', projectId, region],
      });
      onSuccess();
    },
  });
  return {
    createHealthMonitor: (model: THealthMonitorFormState) =>
      mutation.mutate(model),
    ...mutation,
  };
};

type EditHealthMonitorProps = {
  projectId: string;
  region: string;
  healthMonitorId: string;
  onError: (cause: Error) => void;
  onSuccess: () => void;
};

export const useEditHealthMonitor = ({
  projectId,
  region,
  healthMonitorId,
  onError,
  onSuccess,
}: EditHealthMonitorProps) => {
  const mutation = useMutation({
    mutationFn: async (model: THealthMonitorFormState) =>
      editHealthMonitor(projectId, region, healthMonitorId, model),
    onError,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['health-monitor', projectId, region],
      });
      onSuccess();
    },
  });
  return {
    editHealthMonitor: (model: THealthMonitorFormState) =>
      mutation.mutate(model),
    ...mutation,
  };
};

type RenameHealthMonitorProps = EditHealthMonitorProps;

export const useRenameHealthMonitor = ({
  projectId,
  region,
  healthMonitorId,
  onError,
  onSuccess,
}: RenameHealthMonitorProps) => {
  const mutation = useMutation({
    mutationFn: async (name: string) =>
      renameHealthMonitor(projectId, region, healthMonitorId, name),
    onError,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ['health-monitor'],
      });
      onSuccess();
    },
  });
  return {
    renameHealthMonitor: (name: string) => mutation.mutate(name),
    ...mutation,
  };
};
