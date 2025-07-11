import { OKMS } from '@/types/okms.type';

export const filterDomainsByRegion = (domains: OKMS[], region: string) => {
  return domains.filter((domain) => domain.region === region);
};

type GroupedDomains = Record<string, OKMS[]>;

export const groupDomainsByRegion = (domains: OKMS[]): GroupedDomains => {
  const domainsGrouped = domains.reduce<GroupedDomains>((acc, domain) => {
    const { region } = domain;
    if (!acc[region]) {
      acc[region] = [];
    }
    acc[region].push(domain);
    return acc;
  }, {});
  return domainsGrouped;
};
