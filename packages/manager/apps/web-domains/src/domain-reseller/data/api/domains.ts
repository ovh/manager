import { TDomainResource } from '@/domain/types/domainResource';
import { v2, v6 } from '@ovh-ux/manager-core-api';

export const getDomainsListByNicBilling = async (
  nicBilling?: string,
): Promise<TDomainResource[]> => {
  const { data } = await v2.get('/domain/name', {
    params: { contactBilling: nicBilling },
  });
  return data;
};

export const getDomainsListByExcludedNicBilling = async (
  nicBilling: string,
): Promise<TDomainResource[]> => {
  const { data } = await v2.get<TDomainResource[]>('/domain/name');
  return data.filter(
    (domain) =>
      domain.currentState.contactsConfiguration.contactBilling.id !==
      nicBilling,
  );
};

export const updateDomainNicbilling = async (
  domainName: string,
  nicBilling: string,
): Promise<void> => {
  const { data: domainResource } = await v2.get<TDomainResource>(
    `/domain/name/${domainName}`,
  );

  const { contactsConfiguration } = domainResource.currentState;

  await v6.post(`/domain/${domainName}/changeContact`, {
    contactAdmin: contactsConfiguration.contactAdministrator.id,
    contactBilling: nicBilling,
    contactTech: contactsConfiguration.contactTechnical.id,
  });
};
