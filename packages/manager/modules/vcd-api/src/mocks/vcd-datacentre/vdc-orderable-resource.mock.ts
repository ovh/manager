import { VCDOrderableResourceData } from '../../types';

export const orderableResourceData: VCDOrderableResourceData = {
  compute: [
    {
      memoryQuota: 64,
      name: 'vhost-32-64',
      profile: 'pack-3264',
      vCPUCount: 32,
      vCPUSpeed: 3,
    },
    {
      memoryQuota: 64,
      name: 'vhost-16-64',
      profile: 'pack-1664',
      vCPUCount: 16,
      vCPUSpeed: 3,
    },
    {
      memoryQuota: 128,
      name: 'vhost-16-128',
      profile: 'pack-16128',
      vCPUCount: 16,
      vCPUSpeed: 3,
    },
  ],
  storage: [
    {
      capacity: 1000,
      name: 'vcd-datastore-1000',
      profile: 'vcd-datastore-1000',
      type: 'storage',
    },
  ],
};
