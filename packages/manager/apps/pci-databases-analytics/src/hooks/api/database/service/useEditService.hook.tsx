import { useMutation } from '@tanstack/react-query';
import * as database from '@/types/cloud/project/database';
import { EditService, editService } from '@/data/api/database/service.api';
import { CdbError } from '@/data/api/database';

interface UseEditService {
  onError: (cause: CdbError) => void;
  onSuccess: (service: database.Service) => void;
}
export function useEditService({ onError, onSuccess }: UseEditService) {
  const mutation = useMutation({
    mutationFn: (serviceUpdate: EditService) => editService(serviceUpdate),
    onError,
    onSuccess,
  });

  return {
    editService: (serviceAndEngine: EditService) => {
      return mutation.mutate(serviceAndEngine);
    },
    ...mutation,
  };
}
