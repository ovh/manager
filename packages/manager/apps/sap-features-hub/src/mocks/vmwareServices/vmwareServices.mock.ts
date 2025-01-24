import {
  VMwareDatacentre,
  VMwareDatacentreCluster,
  VMwareService,
} from '@/types/vmwareService.type';

export const vmwareServiceList: Partial<VMwareService>[] = [
  {
    displayName: 'PRE48 NSX',
    serviceName: 'pcc-145-239-132-226',
  },
  {
    displayName: 'pcc-145-239-250-87',
    serviceName: 'pcc-145-239-250-87',
  },
];

export const datacentreList: Partial<VMwareDatacentre>[] = [
  {
    datacenterId: 869,
    name: 'datacenter869GG',
  },
  {
    datacenterId: 1450,
    name: 'datacenter1450',
  },
];

export const clusterIdList: number[] = [1006];

export const clusterList: Partial<VMwareDatacentreCluster>[] = [
  {
    clusterId: 1006,
    name: 'Cluster1',
  },
];
