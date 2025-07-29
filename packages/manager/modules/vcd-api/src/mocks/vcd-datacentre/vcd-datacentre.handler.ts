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
  computeResourceId?: string;
  storageResourceId?: string;
};

const findDatacentreById = (params: PathParams) =>
  datacentreList.find(({ id }) => id === params.vdcId);

const findStorages = ({
  storageResourceId,
  nbStorage,
}: GetDatacentresMocksParams) =>
  storageResourceId
    ? storageList.filter(({ id }) => id === storageResourceId)
    : storageList.slice(0, nbStorage);

const findComputes = ({
  computeResourceId,
  nbCompute,
}: GetDatacentresMocksParams) =>
  computeResourceId
    ? computeList.filter(({ id }) => id === computeResourceId)
    : computeList.slice(0, nbCompute);

export const getDatacentresMocks = ({
  isDatacentresKo,
  isDatacentreUpdateKo,
  nbDatacentres = Number.POSITIVE_INFINITY,
  isComputeKO,
  nbCompute = Number.POSITIVE_INFINITY,
  isStorageKO,
  nbStorage = Number.POSITIVE_INFINITY,
  computeResourceId,
  storageResourceId,
}: GetDatacentresMocksParams): Handler[] => [
  {
    url:
      '/vmwareCloudDirector/organization/:id/virtualDataCenter/:vdcId/storage',
    response: isStorageKO
      ? { message: 'Storage error' }
      : findStorages({ nbStorage, storageResourceId }),
    api: 'v2',
    status: isStorageKO ? 500 : 200,
  },
  {
    url:
      '/vmwareCloudDirector/organization/:id/virtualDataCenter/:vdcId/compute',
    response: isComputeKO
      ? { message: 'Compute error' }
      : findComputes({ nbCompute, computeResourceId }),
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
