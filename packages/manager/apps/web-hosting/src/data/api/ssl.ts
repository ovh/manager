import { v6 } from '@ovh-ux/manager-core-api';

import { TCertificate } from '@/data/types/product/ssl';

export const createCertificate = async (
  serviceName: string,
  certificate?: string,
  key?: string,
  chain?: string,
): Promise<TCertificate> => {
  const { data } = await v6.post<TCertificate>(`/hosting/web/${serviceName}/ssl`, {
    certificate,
    key,
    chain,
  });

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

export const createDomainCertificates = async (
  serviceName: string,
  domains: string[],
): Promise<PromiseSettledResult<TCertificate>[]> => {
  const results = await Promise.allSettled(
    domains?.map((domain) => createDomainCertificate(serviceName, domain)),
  );
  const failed = results.find((r): r is PromiseRejectedResult => r.status === 'rejected');

  if (failed) {
    throw failed.reason ?? new Error('Domain certificate creation failed');
  }

  return results;
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
