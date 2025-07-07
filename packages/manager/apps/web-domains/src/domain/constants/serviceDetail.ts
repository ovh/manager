import { ChangelogLinks } from '@ovh-ux/manager-react-components';
import { DashboardTabItemProps } from '@/domain/types/serviceDetail';

export const ServiceDetailTabsProps: DashboardTabItemProps[] = [
  {
    id: 'information',
    name: 'domain_tab_name_general_information',
    value: 'information',
  },
  {
    id: 'zone',
    name: 'domain_tab_name_dns_zone',
    value: 'zone',
  },
  {
    id: 'dns',
    name: 'domain_tab_name_dns_server',
    value: 'dns',
  },
  {
    id: 'redirection',
    name: 'domain_tab_name_redirection',
    value: 'redirection',
  },
  {
    id: 'dynhost',
    name: 'domain_tab_name_dynhost',
    value: 'dynhost',
  },
  {
    id: 'hosts',
    name: 'domain_tab_name_host',
    value: 'hosts',
  },
  {
    id: 'dnssec',
    name: 'domain_tab_name_ds_records',
    value: 'dnssec',
  },
  {
    id: 'contact-management',
    name: 'domain_tab_name_contact_management',
    value: 'contact-management',
  },
];

export const changelogLinks: ChangelogLinks = {
  changelog:
    'https://github.com/orgs/ovh/projects/18/views/2?sliceBy%5Bvalue%5D=Domain+Names&pane=info',
  roadmap:
    'https://github.com/orgs/ovh/projects/18/views/1?sliceBy%5Bvalue%5D=Domain+Names&pane=info',
  'feature-request':
    'https://github.com/ovh/hosting-domain-names-roadmap/issues/new?assignees=&labels=&projects=&template=feature_request.md&title=',
};
