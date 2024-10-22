import { PathParams } from 'msw';
import { Handler } from '../../../../../../playwright-helpers';
import { organizationList } from './vcd-organization.mock';
import { datacentreList } from './vcd-datacentre.mock';

export type GetOrganizationMocksParams = {
  isOrganizationKo?: boolean;
  isOrganizationUpdateKo?: boolean;
  nbOrganization?: number;
  allOrgsBackedUp?: boolean;
  isDatacentresKo?: boolean;
  isDatacentreUpdateKo?: boolean;
  nbDatacentres?: number;
};

const findOrganizationById = (params: PathParams) =>
  organizationList.find(({ id }) => id === params.id);

const findDatacentreById = (params: PathParams) =>
  datacentreList.find(({ id }) => id === params.id);

export const getOrganizationMocks = ({
  isOrganizationKo,
  isOrganizationUpdateKo,
  nbOrganization = Number.POSITIVE_INFINITY,
  allOrgsBackedUp,
  isDatacentresKo,
  isDatacentreUpdateKo,
  nbDatacentres = Number.POSITIVE_INFINITY,
}: GetOrganizationMocksParams): Handler[] => {
  const nb = allOrgsBackedUp ? 1 : nbOrganization;
  return [
    {
      url: '/vmwareCloudDirector/organization/:id/virtualDataCenter',
      response: isDatacentresKo
        ? {
            message: 'Datacentre error',
          }
        : datacentreList.slice(0, nbDatacentres),
      api: 'v2',
      status: isDatacentresKo ? 500 : 200,
    },
    {
      url: '/vmwareCloudDirector/organization/:id/virtualDataCenter/:id',
      response: (_: unknown, params: PathParams) =>
        isDatacentresKo
          ? {
              message: 'Datacentre error',
            }
          : findDatacentreById(params),
      api: 'v2',
      status: isDatacentresKo ? 500 : 200,
    },
    {
      url: '/vmwareCloudDirector/organization/:id/virtualDataCenter/:id',
      response: isDatacentreUpdateKo
        ? {
            message: 'Datacentre update error',
          }
        : {},
      method: 'put',
      api: 'v2',
      status: isDatacentreUpdateKo ? 500 : 200,
    },
    {
      url: '/vmwareCloudDirector/organization/:id',
      response: isOrganizationUpdateKo
        ? {
            message: 'Organization update error',
          }
        : {},
      method: 'put',
      api: 'v2',
      status: isOrganizationUpdateKo ? 500 : 200,
    },
    {
      url: '/vmwareCloudDirector/organization/:id',
      response: (_: unknown, params: PathParams) =>
        isOrganizationKo
          ? {
              message: 'Organization error',
            }
          : findOrganizationById(params),
      api: 'v2',
      status: isOrganizationKo ? 500 : 200,
    },
    {
      url: '/vmwareCloudDirector/organization',
      response: isOrganizationKo
        ? {
            message: 'Organization error',
          }
        : organizationList.slice(0, nb),
      status: isOrganizationKo ? 500 : 200,
      api: 'v2',
    },
  ];
};
