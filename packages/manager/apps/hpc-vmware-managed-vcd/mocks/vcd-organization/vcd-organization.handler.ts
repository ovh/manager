import { PathParams } from 'msw';
import { Handler } from '../../../../../../playwright-helpers';
import { organizationList } from './vcd-organization.mock';

export type GetOrganizationMocksParams = {
  isOrganizationKo?: boolean;
  nbOrganization?: number;
  allOrgsBackedUp?: boolean;
};

const findOrganizationById = (params: PathParams) =>
  organizationList.find(({ id }) => id === params.id);

export const getOrganizationMocks = ({
  isOrganizationKo,
  nbOrganization = Number.POSITIVE_INFINITY,
  allOrgsBackedUp,
}: GetOrganizationMocksParams): Handler[] => {
  const nb = allOrgsBackedUp ? 1 : nbOrganization;
  return [
    {
      url: '/vmwareCloudDirector/organization/:id',
      response: (_: unknown, params: PathParams) =>
        findOrganizationById(params),
      api: 'v2',
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
