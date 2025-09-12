import { v6 } from '@ovh-ux/manager-core-api';
import { Procedure, Procedures } from '@/types/procedure';
import { PROCEDURE_API_PATH_MAP } from '@/data/api/procedure/procedure.constants';

export const fetchProcedureStatus = async (procedure: Procedures) => {
  const { data } = await v6.get<Procedure>(
    `/me/procedure/${PROCEDURE_API_PATH_MAP[procedure]}`,
  );
  return data;
};
