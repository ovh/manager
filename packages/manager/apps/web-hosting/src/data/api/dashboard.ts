import { aapi, v6 } from '@ovh-ux/manager-core-api';

import { TAttachedDomain, TCreateAttachedDomain, TExistingDomain } from '../types/product/domain';
import { DomainServiceType, ServiceInfosType } from '../types/product/service';
import { WebHostingType } from '../types/product/webHosting';

export const getHostingService = async (serviceName: string): Promise<WebHostingType> => {
  const { data } = await v6.get<WebHostingType>(`/hosting/web/${serviceName}`);
  return data;
};

export const getDomainZone = async (): Promise<string[]> => {
  const { data } = await v6.get<string[]>('/domain/zone');
  return data;
};

export const getServiceInfos = async (serviceName: string): Promise<ServiceInfosType> => {
  const { data } = await v6.get<ServiceInfosType>(`/hosting/web/${serviceName}/serviceInfos`);
  return data;
};

export const getDomainService = async (serviceName: string): Promise<DomainServiceType> => {
  const { data } = await v6.get<DomainServiceType>(`/domain/${serviceName}`);
  return data;
};

export const getAddDomainExisting = async (
  serviceName: string,
  path: string,
): Promise<TExistingDomain> => {
  const { data } = await aapi.get<TExistingDomain>(
    `/sws/hosting/web/${serviceName}/add-domain-existing?tokenNeeded=${path === 'B'}`,
  );
  return data;
};

export const updateHostingService = async (serviceName: string, displayName: string) =>
  v6.put(`/hosting/web/${serviceName}`, {
    displayName,
  });

export const createAttachedDomainService = async ({
  serviceName,
  domain,
  cdn,
  firewall,
  ownLog,
  path,
  runtimeId,
  ssl,
  bypassDNSConfiguration,
  ipLocation,
}: TCreateAttachedDomain): Promise<TAttachedDomain> => {
  const { data } = await v6.post<TAttachedDomain>(`/hosting/web/${serviceName}/attachedDomain`, {
    domain,
    cdn,
    firewall,
    ownLog,
    path,
    runtimeId,
    ssl,
    bypassDNSConfiguration,
    ipLocation,
  });
  return data;
};

export const createAttachedDomainsService = async ({
  serviceName,
  domain,
  cdn,
  firewall,
  ownLog,
  path,
  runtimeId,
  ssl,
  bypassDNSConfiguration,
  ipLocation,
  wwwNeeded,
}: TCreateAttachedDomain): Promise<PromiseSettledResult<TAttachedDomain>[]> => {
  const promises = [
    createAttachedDomainService({
      serviceName,
      domain,
      cdn,
      firewall,
      ownLog,
      path,
      runtimeId,
      ssl,
      bypassDNSConfiguration,
      ipLocation,
    }),
  ];

  if (wwwNeeded) {
    promises.push(
      createAttachedDomainService({
        serviceName,
        domain: `www.${domain}`,
        cdn,
        firewall,
        ownLog,
        path,
        runtimeId,
        ssl,
        bypassDNSConfiguration,
        ipLocation,
      }),
    );
  }
  const results = await Promise.allSettled(promises);
  const failed = results.find((r): r is PromiseRejectedResult => r.status === 'rejected');

  if (failed) {
    throw failed.reason ?? new Error('Domain certificate creation failed');
  }

  return results;
};
