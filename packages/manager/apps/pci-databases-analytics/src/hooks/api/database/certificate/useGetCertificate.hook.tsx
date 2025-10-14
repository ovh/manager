import { getCertificate } from '@/data/api/database/certificate.api';
import * as database from '@/types/cloud/project/database';
import {
  OptionsFor,
  useQueryImmediateRefetch,
} from '@/hooks/api/useImmediateRefetch';

export function useGetCertificate(
  projectId: string,
  engine: database.EngineEnum,
  serviceId: string,
  options?: OptionsFor<typeof getCertificate>,
) {
  const queryKey = [projectId, 'database', engine, serviceId, 'certificates'];
  return useQueryImmediateRefetch({
    queryKey,
    queryFn: () => getCertificate({ projectId, engine, serviceId }),
    ...options,
  });
}
