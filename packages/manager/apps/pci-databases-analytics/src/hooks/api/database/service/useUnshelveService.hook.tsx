import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import * as database from '@/types/cloud/project/database';
import { unshelveService } from '@/data/api/database/service.api';
import { CdbError, ServiceData } from '@/data/api/database';

interface UseUnshelveService {
  onError: (cause: CdbError) => void;
  onUnshelveSuccess: (service: database.Service) => void;
}

export function useUnshelveService({
  onError,
  onUnshelveSuccess,
}: UseUnshelveService) {
  const queryClient = useQueryClient();
  const { projectId } = useParams();
  const mutation = useMutation({
    mutationFn: (serviceInfo: ServiceData) => {
      return unshelveService(serviceInfo);
    },
    onError,
    onSuccess: (data) => {
      onUnshelveSuccess(data);
      queryClient.invalidateQueries({
        queryKey: [projectId, 'database/service'],
      });
    },
  });

  return {
    unshelveService: (serviceInfo: ServiceData) => {
      return mutation.mutate(serviceInfo);
    },
    ...mutation,
  };
}
