import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import * as database from '@/types/cloud/project/database';
import { EditService, editService } from '@/data/api/database/service.api';
import { CdbError } from '@/data/api/database';

interface UseEditService {
  onError: (cause: CdbError) => void;
  onEditSuccess: (service: database.Service) => void;
}
export function useEditService({ onError, onEditSuccess }: UseEditService) {
  const queryClient = useQueryClient();
  const { projectId } = useParams();
  const mutation = useMutation({
    mutationFn: (serviceUpdate: EditService) => editService(serviceUpdate),
    onError,
    onSuccess: (data: database.Service) => {
      onEditSuccess(data);
      // Invalidate service list query to get the latest data
      queryClient.invalidateQueries({
        queryKey: [projectId, 'database/service'],
      });
    },
  });

  return {
    editService: (serviceAndEngine: EditService) => {
      return mutation.mutate(serviceAndEngine);
    },
    ...mutation,
  };
}
