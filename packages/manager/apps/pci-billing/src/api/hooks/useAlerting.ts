import { useMutation, useQuery } from '@tanstack/react-query';
import {
  createAlert,
  deleteAlert,
  getAlertById,
  getAllAlertIds,
} from '@/api/data/alert';

export const useGetAlertsIds = (projectId: string) =>
  useQuery({
    queryKey: ['project', projectId, 'alerting', 'alertsIds'],
    queryFn: () => getAllAlertIds(projectId),
    enabled: !!projectId,
  });

export const useGetAlert = (projectId: string) => {
  const { data: alertsIds, isLoading: isAlertsIdsLoading } = useGetAlertsIds(
    projectId,
  );
  const alertId = alertsIds ? alertsIds[0] : '';
  const { data: alert, isLoading: isAlertLoading } = useQuery({
    queryKey: ['project', projectId, 'alerting', alertId],
    queryFn: () => getAlertById(projectId, alertId),
    enabled: !!projectId && !!alertId,
  });

  return {
    data: alert,
    isLoading: isAlertsIdsLoading || isAlertLoading,
  };
};

export const useCreateAlert = (
  projectId: string,
  email: string,
  threshold: number,
  onSuccess: () => void,
  onError: () => void,
) => {
  const mutation = useMutation({
    mutationFn: async () => createAlert(projectId, email, threshold),
    onError,
    onSuccess: async () => {
      onSuccess();
    },
  });

  return {
    createAlert: () => mutation.mutate(),
    ...mutation,
  };
};

export const useDeleteAlert = (
  projectId: string,
  alertId: string,
  onSuccess: () => void,
  onError: () => void,
) => {
  const mutation = useMutation({
    mutationFn: async () => deleteAlert(projectId, alertId),
    onError,
    onSuccess: async () => {
      onSuccess();
    },
  });

  return {
    deleteAlert: () => mutation.mutate(),
    ...mutation,
  };
};
