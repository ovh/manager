import { PathParams } from 'msw';
import { Handler } from '@ovh-ux/manager-core-test-utils';
import { datacentreList } from './vcd-datacentre.mock';
import { computeList } from './vdc-compute.mock';
import { storageList } from './vdc-storage.mock';

export type GetDatacentresMocksParams = {
  isDatacentresKo?: boolean;
  isDatacentreUpdateKo?: boolean;
  nbDatacentres?: number;
  isComputeKO?: boolean;
  nbCompute?: number;
  isStorageKO?: boolean;
  nbStorage?: number;
  resourceId?: string;
};

const findDatacentreById = (params: PathParams) =>
  datacentreList.find(({ id }) => id === params.vdcId);

const findStorages = ({ resourceId, nbStorage }: GetDatacentresMocksParams) =>
  resourceId
    ? storageList.filter(({ id }) => id === resourceId)
    : storageList.slice(0, nbStorage);

const findComputes = ({ resourceId, nbStorage }: GetDatacentresMocksParams) =>
  resourceId
    ? computeList.filter(({ id }) => id === resourceId)
    : computeList.slice(0, nbStorage);

export const getDatacentresMocks = ({
  isDatacentresKo,
  isDatacentreUpdateKo,
  nbDatacentres = Number.POSITIVE_INFINITY,
  isComputeKO,
  nbCompute = Number.POSITIVE_INFINITY,
  isStorageKO,
  nbStorage = Number.POSITIVE_INFINITY,
  resourceId,
}: GetDatacentresMocksParams): Handler[] => [
  {
    url:
      '/vmwareCloudDirector/organization/:id/virtualDataCenter/:vdcId/storage',
    response: isStorageKO
      ? { message: 'Storage error' }
      : findStorages({ nbStorage, resourceId }),
    api: 'v2',
    status: isStorageKO ? 500 : 200,
  },
  {
    url:
      '/vmwareCloudDirector/organization/:id/virtualDataCenter/:vdcId/compute',
    response: isComputeKO
      ? { message: 'Compute error' }
      : findComputes({ nbCompute, resourceId }),
    api: 'v2',
    status: isComputeKO ? 500 : 200,
  },
  {
    url: '/vmwareCloudDirector/organization/:id/virtualDataCenter',
    response: isDatacentresKo
      ? { message: 'Datacentres error' }
      : datacentreList.slice(0, nbDatacentres),
    api: 'v2',
    status: isDatacentresKo ? 500 : 200,
  },
  {
    url: '/vmwareCloudDirector/organization/:id/virtualDataCenter/:vdcId',
    response: (_: unknown, params: PathParams) =>
      isDatacentresKo
        ? { message: 'Datacentre error' }
        : findDatacentreById(params),
    api: 'v2',
    status: isDatacentresKo ? 500 : 200,
  },
  {
    url: '/vmwareCloudDirector/organization/:id/virtualDataCenter/:vdcId',
    response: isDatacentreUpdateKo
      ? { message: 'Datacentre update error' }
      : {},
    method: 'put',
    api: 'v2',
    status: isDatacentreUpdateKo ? 500 : 200,
  },
];
