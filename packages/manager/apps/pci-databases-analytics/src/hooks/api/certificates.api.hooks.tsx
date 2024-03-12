import {
  QueryObserverOptions,
  UseQueryResult,
  useQuery,
} from '@tanstack/react-query';

import { getCertificate } from '@/api/databases/certificates';
import { database } from '@/models/database';

export function useGetCertificate(
  projectId: string,
  engine: database.EngineEnum,
  serviceId: string,
  options: Omit<QueryObserverOptions, 'queryKey'> = {},
) {
  const queryKey = [projectId, 'database', engine, serviceId, 'certificates'];
  return useQuery({
    queryKey,
    queryFn: () => getCertificate({ projectId, engine, serviceId }),
    ...options,
  }) as UseQueryResult<database.service.Certificates, Error>;
}
