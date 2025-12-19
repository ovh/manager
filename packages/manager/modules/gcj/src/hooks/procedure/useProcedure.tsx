import { useContext } from 'react';

import {
  DefinedInitialDataOptions,
  QueryClientContext,
  useQuery,
} from '@tanstack/react-query';

import { fetchProcedureStatus } from '@/hooks/procedure/api/procedure';
import { Procedure, Procedures } from '@/types/procedure.type';

export const useProcedureStatus = (
  procedure: Procedures,
  options: Partial<DefinedInitialDataOptions<Procedure>> = {},
) =>
  useQuery({
    ...options,
    queryKey: ['procedure', 'status', procedure],
    queryFn: () => fetchProcedureStatus(procedure),
  });
