import { useMutation } from '@tanstack/react-query';
import { deleteService } from '@/data/api/database/service.api';
import { ServiceData } from '@/data/api/database';

interface UseDeleteService {
  onError: (cause: Error) => void;
  onSuccess: () => void;
}

export function useDeleteService({ onError, onSuccess }: UseDeleteService) {
  const mutation = useMutation({
    mutationFn: (serviceInfo: ServiceData) => {
      return deleteService(serviceInfo);
    },
    onError,
    onSuccess,
  });

  return {
    deleteService: (serviceInfo: ServiceData) => {
      return mutation.mutate(serviceInfo);
    },
    ...mutation,
  };
}
