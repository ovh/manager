import { v6 } from '@ovh-ux/manager-core-api';
import { TCertificate } from '@/types/ssl';

export const deleteDomainCertificate = async (
  serviceName: string,
  domain: string,
): Promise<TCertificate> => {
  const { data } = await v6.delete<TCertificate>(
    `/hosting/web/${serviceName}/attachedDomain/${domain}/ssl`,
  );

  return data;
};
