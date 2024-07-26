import { useMutation } from '@tanstack/react-query';
import { resetQueryStatistics } from '@/data/api/database/queries.api';
import { CdbError, ServiceData } from '@/data/api/database';

interface UseResetQueryStatistics {
  onError: (cause: CdbError) => void;
  onSuccess: () => void;
}
export function useResetQueryStatistics({
  onError,
  onSuccess,
}: UseResetQueryStatistics) {
  const mutation = useMutation({
    mutationFn: (serviceInfo: ServiceData) => {
      return resetQueryStatistics(serviceInfo);
    },
    onError,
    onSuccess,
  });

  return {
    resetQueryStatistics: (serviceInfo: ServiceData) => {
      return mutation.mutate(serviceInfo);
    },
    ...mutation,
  };
}
