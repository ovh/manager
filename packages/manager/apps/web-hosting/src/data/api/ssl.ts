import { v6 } from '@ovh-ux/manager-core-api';
import { TCertificate } from '@/types/ssl';

export const getDomainCertificate = async (
  serviceName: string,
  domain: string,
): Promise<string[]> => {
  const { data } = await v6.get<string[]>(
    `/hosting/web/${serviceName}/attachedDomain/${domain}/ssl`,
  );
  return data;
};

export const createDomainCertificate = async (
  serviceName: string,
  domain: string,
): Promise<TCertificate> => {
  const { data } = await v6.post<TCertificate>(
    `/hosting/web/${serviceName}/attachedDomain/${domain}/ssl`,
  );

  return data;
};

export const regenerateDomainCertificate = async (
  serviceName: string,
  domain: string,
): Promise<string[]> => {
  const { data } = await v6.put<string[]>(
    `/hosting/web/${serviceName}/attachedDomain/${domain}/ssl`,
    {
      regenerate: true,
    },
  );
  return data;
};

export const deleteDomainCertificate = async (
  serviceName: string,
  domain: string,
): Promise<TCertificate> => {
  const { data } = await v6.delete<TCertificate>(
    `/hosting/web/${serviceName}/attachedDomain/${domain}/ssl`,
  );

  return data;
};

export const createCertificate = async (
  serviceName: string,
  certificate?: string,
  key?: string,
  chain?: string,
): Promise<TCertificate> => {
  const { data } = await v6.post<TCertificate>(
    `/hosting/web/${serviceName}/ssl`,
    {
      certificate,
      key,
      chain,
    },
  );

  return data;
};
