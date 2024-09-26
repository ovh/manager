import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import * as database from '@/types/cloud/project/database';
import { addService } from '@/data/api/database/service.api';
import { CdbError } from '@/data/api/database';

interface UseAddService {
  onError: (cause: CdbError) => void;
  onSuccess: (service: database.Service) => void;
}
export interface ServiceCreationWithEngine
  extends Partial<database.ServiceCreation> {
  engine: database.EngineEnum;
}
export function useAddService({ onError, onSuccess }: UseAddService) {
  const queryClient = useQueryClient();
  const { projectId } = useParams();
  const mutation = useMutation({
    mutationFn: (serviceAndEngine: ServiceCreationWithEngine) => {
      const { engine, ...serviceInfo } = serviceAndEngine;
      return addService({ projectId, engine, serviceInfo });
    },
    onError,
    onSuccess: (data) => {
      // invalidate services list to avoid displaying
      // old list
      queryClient.invalidateQueries({
        queryKey: [projectId, 'database/service'],
        refetchType: 'none',
      });
      onSuccess(data);
    },
  });

  return {
    addService: (serviceAndEngine: ServiceCreationWithEngine) => {
      return mutation.mutate(serviceAndEngine);
    },
    ...mutation,
  };
}
