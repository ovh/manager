import { TDomainResource } from './domainResource';

export type DashboardTabItemProps = {
  id: string;
  name: string;
  value: string;
  rule?: (domainResource: TDomainResource, isInCreation: boolean) => boolean;
};
