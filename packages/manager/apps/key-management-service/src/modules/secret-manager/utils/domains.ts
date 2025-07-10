import { OKMS } from '@/types/okms.type';

type FilterDomainsByRegionParams = {
  domains: OKMS[];
  region: string;
};

export const filterDomainsByRegion = ({
  domains,
  region,
}: FilterDomainsByRegionParams) =>
  domains.filter((domain) => domain.region === region);
