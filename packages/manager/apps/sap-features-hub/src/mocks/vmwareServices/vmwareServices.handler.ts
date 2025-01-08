import { Handler } from '@ovh-ux/manager-core-test-utils';
import {
  clusterIdList,
  clusterList,
  datacentreList,
  vmwareServiceList,
} from './vmwareServices.mock';

export type GetInstallationServiceMocksParams = {
  isVMwareServicesKo?: boolean;
  nbVMwareServices?: number;
  isDatacentresKo?: boolean;
  nbDatacentres?: number;
  isClustersKo?: boolean;
  nbClusters?: number;
};

export const getInstallationServiceMocks = ({
  isVMwareServicesKo,
  isDatacentresKo,
  isClustersKo,
  nbVMwareServices = Number.POSITIVE_INFINITY,
  nbDatacentres = Number.POSITIVE_INFINITY,
  nbClusters = Number.POSITIVE_INFINITY,
}: GetInstallationServiceMocksParams): Handler[] => [
  {
    url: '/service?type=/dedicatedCloud&subType=EPCC&external=false',
    response: isVMwareServicesKo
      ? { message: 'VMwareServices error' }
      : vmwareServiceList.slice(0, nbVMwareServices),
    api: 'aapi',
    status: isVMwareServicesKo ? 500 : 200,
  },
  {
    url: '/sws/dedicatedCloud/:serviceName/datacenters-summary',
    response: isDatacentresKo
      ? { message: 'Datacentres error' }
      : datacentreList.slice(0, nbDatacentres),
    api: 'aapi',
    status: isDatacentresKo ? 500 : 200,
  },
  {
    url: '/dedicatedCloud/:serviceName/datacenter/:datacenterId/cluster',
    response: isClustersKo
      ? { message: 'Clusters error' }
      : clusterIdList.slice(0, nbClusters),
    api: 'v6',
    status: isClustersKo ? 500 : 200,
  },
  {
    url:
      '/dedicatedCloud/:serviceName/datacenter/:datacenterId/cluster/:clusterId',
    response: isClustersKo ? { message: 'Cluster error' } : clusterList[0],
    api: 'v6',
    status: isClustersKo ? 500 : 200,
  },
];
