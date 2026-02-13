import { useMutation } from '@tanstack/react-query';
import * as database from '@/types/cloud/project/database';
import {
  CancelQuery,
  cancelCurrentQuery,
} from '@/data/api/database/queries.api';
import { CdbError } from '@/data/api/database';

interface UseCancelCurrentQuery {
  onError: (cause: CdbError) => void;
  onSuccess: (
    database: database.service.currentqueries.query.CancelResponse,
  ) => void;
}
export function useCancelCurrentQuery({
  onError,
  onSuccess,
}: UseCancelCurrentQuery) {
  const mutation = useMutation({
    mutationFn: (currentQueryInfo: CancelQuery) => {
      return cancelCurrentQuery(currentQueryInfo);
    },
    onError,
    onSuccess,
  });

  return {
    cancelCurrentQuery: (currentQueryInfo: CancelQuery) => {
      return mutation.mutate(currentQueryInfo);
    },
    ...mutation,
  };
}
