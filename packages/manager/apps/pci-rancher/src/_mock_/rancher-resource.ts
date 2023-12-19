import { RancherPlan, RancherVersion } from '@/api/api.type';

export const rancherPlan: RancherPlan[] = [
  {
    name: 'OVHCLOUD_EDITION',
    status: 'UNAVAILABLE',
  },
  {
    name: 'STANDARD',
    status: 'AVAILABLE',
  },
];

export const rancherVersion: RancherVersion[] = [
  {
    name: 'v2.7.5',
    status: 'UNAVAILABLE',
  },
  {
    name: 'v2.7.6',
    status: 'AVAILABLE',
  },
];
