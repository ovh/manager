import { RancherVersion } from '@/api/api.type';
import { rancherMocked } from './rancher';

export const versionsMocked: RancherVersion[] = [
  {
    changelogUrl: 'https://www.ovh.com',
    name: rancherMocked.targetSpec.version,
    status: 'AVAILABLE',
  },
  {
    changelogUrl: 'https://www.ovh.com',
    name: '2.9.6',
    status: 'AVAILABLE',
  },
  {
    changelogUrl: 'https://www.ovh.com',
    name: '2.9.7',
    status: 'UNAVAILABLE',
  },
  {
    changelogUrl: 'https://www.ovh2.com',
    name: '2.9.8',
    status: 'AVAILABLE',
  },
];
