import { PathParams } from 'msw';
import { Handler } from '../../../../../../playwright-helpers';
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
};

const findDatacentreById = (params: PathParams) =>
  datacentreList.find(({ id }) => id === params.id);

export const getDatacentresMocks = ({
  isDatacentresKo,
  isDatacentreUpdateKo,
  nbDatacentres = Number.POSITIVE_INFINITY,
  isComputeKO,
  nbCompute = Number.POSITIVE_INFINITY,
  isStorageKO,
  nbStorage = Number.POSITIVE_INFINITY,
}: GetDatacentresMocksParams): Handler[] => [
  {
    url: '/vmwareCloudDirector/organization/:id/virtualDataCenter/:id/storage',
    response: isStorageKO
      ? { message: 'Storage error' }
      : storageList.slice(0, nbStorage),
    api: 'v2',
    status: isStorageKO ? 500 : 200,
  },
  {
    url: '/vmwareCloudDirector/organization/:id/virtualDataCenter/:id/compute',
    response: isComputeKO
      ? { message: 'Compute error' }
      : computeList.slice(0, nbCompute),
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
    url: '/vmwareCloudDirector/organization/:id/virtualDataCenter/:id',
    response: (_: unknown, params: PathParams) =>
      isDatacentresKo
        ? { message: 'Datacentre error' }
        : findDatacentreById(params),
    api: 'v2',
    status: isDatacentresKo ? 500 : 200,
  },
  {
    url: '/vmwareCloudDirector/organization/:id/virtualDataCenter/:id',
    response: isDatacentreUpdateKo
      ? { message: 'Datacentre update error' }
      : {},
    method: 'put',
    api: 'v2',
    status: isDatacentreUpdateKo ? 500 : 200,
  },
];
