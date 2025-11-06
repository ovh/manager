import { v6 } from '@ovh-ux/manager-core-api';

import {
  CdnAvailableOption,
  CdnDomain,
  CdnDomainOption,
  CdnProperties,
  PurgeCDN,
} from '../types/product/cdn';

export const getCDNProperties = async (serviceName: string): Promise<CdnProperties> => {
  const { data } = await v6.get<CdnProperties>(`/hosting/web/${serviceName}/cdn`);
  return data;
};

export const getSharedCDNAvailableOptions = async (
  serviceName: string,
): Promise<CdnAvailableOption[]> => {
  const { data } = await v6.get<CdnAvailableOption[]>(
    `/hosting/web/${serviceName}/cdn/availableOptions`,
  );

  return data;
};

export const getSharedCDNDomains = async (serviceName: string): Promise<CdnDomain[]> => {
  const { data } = await v6.get<CdnDomain[]>(`/hosting/web/${serviceName}/cdn/domain`);

  return data;
};

export const getSharedCDNDomainDetails = async (
  serviceName: string,
  domain: string,
): Promise<CdnDomain> => {
  const { data } = await v6.get<CdnDomain>(`/hosting/web/${serviceName}/cdn/domain/${domain}`);

  return data;
};

export const getCDNDomainsOptions = async (
  serviceName: string,
  domain: string,
): Promise<CdnDomainOption[]> => {
  const { data } = await v6.get<CdnDomainOption[]>(
    `/hosting/web/${serviceName}/cdn/domain/${domain}/option`,
  );

  return data;
};
export const addNewOptionToDomain = async (serviceName: string, domain: string) => {
  const { data } = await v6.post<CdnDomainOption>(
    `/hosting/web/${serviceName}/cdn/domain/${domain}/option`,
  );
  return data;
};

export const resetCDNOptionToDefault = async (
  serviceName: string,
  domain: string,
  option: string,
) => {
  const { data } = await v6.delete<void>(
    `/hosting/web/${serviceName}/cdn/domain/${domain}/option/${option}`,
  );
  return data;
};

export const getCDNDomainOptionDetails = async (
  serviceName: string,
  domain: string,
  option: string,
): Promise<CdnDomainOption> => {
  const { data } = await v6.get<CdnDomainOption>(
    `/hosting/web/${serviceName}/cdn/domain/${domain}/option/${option}`,
  );
  return data;
};

export const flushCdn = async (serviceName: string) => {
  const { data } = await v6.post<void>(`hosting/web/${serviceName}/request`, {
    action: 'FLUSH_CACHE',
  });
  return data;
};
export const flushCDNDomainCache = async (
  serviceName: string,
  domain: string,
  queryParams?: string,
) => {
  const { data } = await v6.post<PurgeCDN>(
    `/hosting/web/${serviceName}/cdn/domain/${domain}/purge?${queryParams}`,
  );

  return data;
};
