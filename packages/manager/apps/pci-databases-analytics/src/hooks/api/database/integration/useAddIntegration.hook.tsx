import { useMutation } from '@tanstack/react-query';
import * as database from '@/types/cloud/project/database';
import {
  AddIntegration,
  addIntegration,
} from '@/data/api/database/integration.api';
import { CdbError } from '@/data/api/database';

interface UseAddIntegration {
  onError: (cause: CdbError) => void;
  onSuccess: (database: database.service.Integration) => void;
}
export function useAddIntegration({ onError, onSuccess }: UseAddIntegration) {
  const mutation = useMutation({
    mutationFn: (integrationInfo: AddIntegration) => {
      return addIntegration(integrationInfo);
    },
    onError,
    onSuccess,
  });

  return {
    addIntegration: (integrationInfo: AddIntegration) => {
      return mutation.mutate(integrationInfo);
    },
    ...mutation,
  };
}
