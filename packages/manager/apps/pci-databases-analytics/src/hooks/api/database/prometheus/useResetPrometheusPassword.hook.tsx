import { useMutation } from '@tanstack/react-query';
import * as database from '@/types/cloud/project/database';
import { CdbError, ServiceData } from '@/data/api/database';
import { resetPrometheusUserPassword } from '@/data/api/database/prometheus.api';

interface UseResetPrometheusPassword {
  onError: (cause: CdbError) => void;
  onSuccess: (user: database.service.PrometheusAccess) => void;
}
export function useResetPrometheusPassword({
  onError,
  onSuccess,
}: UseResetPrometheusPassword) {
  const mutation = useMutation({
    mutationFn: (serviceData: ServiceData) => {
      return resetPrometheusUserPassword(serviceData);
    },
    onError,
    onSuccess,
  });

  return {
    resetPrometheusUserPassword: (serviceData: ServiceData) => {
      return mutation.mutate(serviceData);
    },
    ...mutation,
  };
}
