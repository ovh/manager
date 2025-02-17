import { ChangelogLinks } from '@ovh-ux/manager-react-components';

export const packTypeLabel = {
  'hycu-cloud-vm-pack-25': '25 VMs',
  'hycu-cloud-vm-pack-50': '50 VMs',
  'hycu-cloud-vm-pack-100': '100 VMs',
  'hycu-cloud-vm-pack-150': '150 VMs',
  'hycu-cloud-vm-pack-200': '200 VMs',
  'hycu-cloud-vm-pack-250': '250 VMs',
  'hycu-cloud-vm-pack-500': '500 VMs',
} as const;
export const LICENSE_FILE_EXT = '.req';
export const LICENSE_FILE_NAME_TEMPLATE = `license-hycu-{serviceName}.dat`;
export const HYCU_CHANGE_PACK_FEATURE = 'hycu:change-pack';

export const CHANGELOG_LINKS: ChangelogLinks = {
  changelog:
    'https://github.com/orgs/ovh/projects/16/views/6?pane=info&sliceBy%5Bvalue%5D=Backup+and+Disaster+Recovery',
  roadmap:
    'https://github.com/orgs/ovh/projects/16/views/1?pane=info&sliceBy%5Bvalue%5D=Backup+and+Disaster+Recovery',
  'feature-request': 'https://github.com/ovh/private-cloud-roadmap/issues/new',
};
