import { queryOptions, useQuery } from '@tanstack/react-query';
import {
  getInstallationTaskDetails,
  TGetInstallationTaskParams,
} from '@/data/api/sapInstallations';

export const installationTaskDetailsQueryKey = ({
  serviceName,
  taskId,
}: TGetInstallationTaskParams) => ['sap', serviceName, 'tasks', taskId];

export const useInstallationTaskDetailsOptions = ({
  serviceName,
  taskId,
}: TGetInstallationTaskParams) =>
  queryOptions({
    queryKey: installationTaskDetailsQueryKey({ serviceName, taskId }),
    queryFn: () => getInstallationTaskDetails({ serviceName, taskId }),
    select: (res) => res.data,
    enabled: () => !!serviceName && !!taskId,
  });

export const useInstallationTaskDetails = ({
  serviceName,
  taskId,
}: TGetInstallationTaskParams) =>
  useQuery(useInstallationTaskDetailsOptions({ serviceName, taskId }));
