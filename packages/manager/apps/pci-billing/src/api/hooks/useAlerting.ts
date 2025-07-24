import { useMutation, useQuery } from '@tanstack/react-query';
import { ApiError } from '@ovh-ux/manager-core-api';
import {
  createAlert,
  deleteAlert,
  getAlertById,
  getAllAlertIds,
  updateAlert,
} from '@/api/data/alert';

const useGetAlertsIds = (projectId: string) =>
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
  onSuccess: () => void,
  onError: () => void,
) => {
  const mutation = useMutation({
    mutationFn: ({ email, threshold }: { email: string; threshold: number }) =>
      createAlert(projectId, email, threshold),
    onError,
    onSuccess: async () => {
      onSuccess();
    },
  });

  return {
    createAlert: mutation.mutate,
    ...mutation,
  };
};

export const useUpdateAlert = (
  projectId: string,
  onSuccess: () => void,
  onError: () => void,
) => {
  const mutation = useMutation({
    mutationFn: async ({
      alertId,
      email,
      threshold,
    }: {
      alertId: string;
      email: string;
      threshold: number;
    }) => {
      await updateAlert(projectId, alertId, email, threshold);
    },
    onError,
    onSuccess: async () => {
      onSuccess();
    },
  });

  return {
    updateAlert: mutation.mutate,
    ...mutation,
  };
};

export const useDeleteAlert = (
  projectId: string,
  onSuccess: () => void,
  onError: (err: ApiError) => void,
) => {
  const mutation = useMutation({
    mutationFn: async (alertId: string) => deleteAlert(projectId, alertId),
    onError,
    onSuccess: async () => {
      onSuccess();
    },
  });

  return {
    deleteAlert: mutation.mutate,
    ...mutation,
  };
};
