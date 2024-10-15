import { v6 } from '@ovh-ux/manager-core-api';
import { KycProcedures, KycStatus } from '@/types/kyc.type';

export const getKycStatus: (
  procedure: KycProcedures,
) => Promise<KycStatus> = async (procedure: KycProcedures) => {
  const { data } = await v6.get<KycStatus>(`/me/procedure/${procedure}`);
  return data;
};
