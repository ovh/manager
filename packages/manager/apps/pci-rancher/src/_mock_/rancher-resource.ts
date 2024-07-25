import { RancherPlan, RancherVersion } from '@/api/api.type';

export const rancherPlan: RancherPlan[] = [
  {
    name: 'OVHCLOUD_EDITION',
    status: 'AVAILABLE',
  },
  {
    name: 'STANDARD',
    status: 'AVAILABLE',
  },
];

export const rancherVersion: RancherVersion[] = [
  {
    name: 'v2.7.4',
    status: 'AVAILABLE',
  },
  {
    name: 'v2.7.5',
    status: 'UNAVAILABLE',
    changelogUrl: 'https://changelog.ovh.com',
  },
  {
    name: 'v2.7.6',
    status: 'AVAILABLE',
    changelogUrl: 'https://changelog.ovh.com',
  },
];
