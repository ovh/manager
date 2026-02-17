import { DashboardTabItemProps } from '@/domain/types/serviceDetail';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';

export const DomainResellerTabsProps: DashboardTabItemProps[] = [
  {
    id: 'serviceDetail',
    name: `${NAMESPACES.DASHBOARD}:general_information`,
    value: 'information',
  },
  {
    id: 'domainsList',
    name: 'domain_reseller_tab_my_domains',
    value: 'my-domains',
  },
];
