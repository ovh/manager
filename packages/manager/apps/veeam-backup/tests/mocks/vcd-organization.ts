import { PathParams } from 'msw';
import { Handler } from '../../../../../../playwright-helpers';
import organizationList from './vcd-organization.json';

export type GetOrganizationMocksParams = {
  isOrganizationKo?: boolean;
  nbOrganization?: number;
  allOrgsBackedUp?: boolean;
};

const findOrganiationById = (params: PathParams) =>
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
      response: (_, params: PathParams) => findOrganiationById(params),
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
