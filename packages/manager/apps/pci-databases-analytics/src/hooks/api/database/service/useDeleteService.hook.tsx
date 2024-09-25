import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import * as database from '@/types/cloud/project/database';
import { deleteService } from '@/data/api/database/service.api';
import { CdbError, ServiceData } from '@/data/api/database';

interface UseDeleteService {
  onError: (cause: CdbError) => void;
  onSuccess: () => void;
}

export function useDeleteService({ onError, onSuccess }: UseDeleteService) {
  const queryClient = useQueryClient();
  const { projectId } = useParams();
  const mutation = useMutation({
    mutationFn: (serviceInfo: ServiceData) => {
      return deleteService(serviceInfo);
    },
    onError,
    onSuccess: () => {
      onSuccess();
      // Invalidate service list query to get the latest data
      queryClient.invalidateQueries({
        queryKey: [projectId, 'database/service'],
      });
    },
  });

  return {
    deleteService: (serviceInfo: ServiceData) => {
      return mutation.mutate(serviceInfo);
    },
    ...mutation,
  };
}
