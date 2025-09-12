import { DefinedInitialDataOptions, useQuery } from '@tanstack/react-query';
import { fetchProcedureStatus } from '@/data/api/procedure/procedure';
import { Procedure, Procedures } from '@/types/procedure';

export const useProcedureStatus = (
  procedure: Procedures,
  options: Partial<DefinedInitialDataOptions<Procedure>> = {},
) =>
  useQuery({
    ...options,
    queryKey: ['procedure', 'status', procedure],
    queryFn: () => fetchProcedureStatus(procedure),
  });
