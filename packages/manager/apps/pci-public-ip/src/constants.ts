import { ChangelogLinks } from '@ovh-ux/manager-react-components';

export enum IPsTabName {
  FLOATING_IP_TAB_NAME = 'FLOATING_IP',
  ADDITIONAL_IP_TAB_NAME = 'ADDITIONAL_IP',
}

export const pciAnnouncementBannerId = 'public-cloud:pci-announcement-banner';

export const CHANGELOG_LINKS: ChangelogLinks = {
  changelog:
    'https://github.com/orgs/ovh/projects/16/views/6?pane=info&sliceBy%5Bvalue%5D=Public+Cloud+Networking',
  roadmap:
    'https://github.com/orgs/ovh/projects/16/views/1?pane=info&sliceBy%5Bvalue%5D=Public+Cloud+Networking',
  'feature-request':
    'https://github.com/ovh/public-cloud-roadmap/issues/new?assignees=&labels=&projects=&template=feature_request.md&title=',
};
