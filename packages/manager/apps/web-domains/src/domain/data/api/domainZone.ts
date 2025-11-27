import { v6 } from '@ovh-ux/manager-core-api';
import { DnssecStatus, TDomainZone } from '@/domain/types/domainZone';
import { TServiceOption } from '@/common/types/common.types';
/**
 *  : Get Zone attached to Domain Service
 */
export const getDomainZone = async (
  serviceName: string,
): Promise<TDomainZone> => {
  const { data } = await v6.get(`/domain/zone/${serviceName}`);
  return data;
};

export const getServiceOptions = async (
  serviceId: number,
): Promise<TServiceOption[]> => {
  const { data } = await v6.get(`/services/${serviceId}/options`);
  return data;
};

export const getServiceDnssec = async (
  serviceName: string,
): Promise<DnssecStatus> => {
  const { data } = await v6.get(`/domain/zone/${serviceName}/dnssec`);
  return data;
};

export const activateServiceDnssec = async (
  serviceName: string,
): Promise<null> => {
  const { data } = await v6.post(`/domain/zone/${serviceName}/dnssec`);
  return data;
};

export const deactivateServiceDnssec = async (
  serviceName: string,
): Promise<null> => {
  const { data } = await v6.delete(`/domain/zone/${serviceName}/dnssec`);
  return data;
};
