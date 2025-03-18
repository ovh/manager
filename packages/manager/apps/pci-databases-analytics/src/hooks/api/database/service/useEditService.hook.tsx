import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import * as database from '@/types/cloud/project/database';
import { EditService, editService } from '@/data/api/database/service.api';
import { CdbError } from '@/data/api/database';

interface UseEditService<T extends database.Service = database.Service> {
  onError: (cause: CdbError) => void;
  onEditSuccess: (service: T) => void;
}
export function useEditService<T extends database.Service = database.Service>({
  onError,
  onEditSuccess,
}: UseEditService<T>) {
  const queryClient = useQueryClient();
  const { projectId } = useParams();
  const mutation = useMutation({
    mutationFn: (serviceUpdate: EditService) => editService(serviceUpdate),
    onError,
    onSuccess: (data: T) => {
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
