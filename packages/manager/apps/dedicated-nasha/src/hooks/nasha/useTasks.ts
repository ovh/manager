import { useQuery } from '@tanstack/react-query';
import { getTasks, getTask, getTasksBy } from '@/api/nasha/nasha';
import type { NashaTask } from '@/types/nasha.type';
import { nashaKeys } from './useNasha';

// Query keys for tasks
export const taskKeys = {
  all: (serviceName: string) =>
    [...nashaKeys.detail(serviceName), 'tasks'] as const,
  list: (serviceName: string) => [...taskKeys.all(serviceName)] as const,
  detail: (serviceName: string, taskId: number) =>
    [...taskKeys.all(serviceName), taskId] as const,
};

/**
 * Hook to get all tasks for a NAS-HA
 */
export const useTasks = (serviceName: string) => {
  return useQuery<NashaTask[], Error>({
    queryKey: taskKeys.list(serviceName),
    queryFn: () => getTasks(serviceName),
    enabled: !!serviceName,
  });
};

/**
 * Hook to get a single task
 */
export const useTask = (serviceName: string, taskId: number) => {
  return useQuery<NashaTask, Error>({
    queryKey: taskKeys.detail(serviceName, taskId),
    queryFn: () => getTask(serviceName, taskId),
    enabled: !!serviceName && !!taskId,
    refetchInterval: (query) => {
      // Poll every 2 seconds while task is pending
      const task = query.state.data;
      if (task && ['todo', 'doing'].includes(task.status)) {
        return 2000;
      }
      return false;
    },
  });
};

/**
 * Hook to get tasks filtered by criteria
 */
export const useTasksBy = (
  serviceName: string,
  params: {
    operation?: string;
    status?: string;
    partitionName?: string;
  },
) => {
  return useQuery<NashaTask[], Error>({
    queryKey: [...taskKeys.list(serviceName), params],
    queryFn: () => getTasksBy(serviceName, params),
    enabled: !!serviceName,
  });
};

/**
 * Hook to track multiple tasks
 */
export const useTrackTasks = (
  serviceName: string,
  taskIds: number[],
  enabled = true,
) => {
  return useQuery<NashaTask[], Error>({
    queryKey: [...taskKeys.all(serviceName), 'track', taskIds],
    queryFn: async () => {
      const tasks = await Promise.all(
        taskIds.map((taskId) => getTask(serviceName, taskId)),
      );
      return tasks;
    },
    enabled: enabled && !!serviceName && taskIds.length > 0,
    refetchInterval: (query) => {
      // Poll every 2 seconds while any task is pending
      const tasks = query.state.data;
      if (tasks?.some((task) => ['todo', 'doing'].includes(task.status))) {
        return 2000;
      }
      return false;
    },
  });
};

