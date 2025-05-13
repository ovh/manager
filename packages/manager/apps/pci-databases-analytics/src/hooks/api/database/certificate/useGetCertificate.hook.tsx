import { QueryObserverOptions, UseQueryResult } from '@tanstack/react-query';

import { getCertificate } from '@/data/api/database/certificate.api';
import * as database from '@/types/cloud/project/database';
import { useQueryImmediateRefetch } from '@/hooks/api/useImmediateRefetch';

export function useGetCertificate(
  projectId: string,
  engine: database.EngineEnum,
  serviceId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'database', engine, serviceId, 'certificates'];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getCertificate({ projectId, engine, serviceId }),
    ...options,
  }) as UseQueryResult<database.service.Certificates, Error>;
}
