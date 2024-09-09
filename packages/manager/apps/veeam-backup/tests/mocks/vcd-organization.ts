import { PathParams } from 'msw';
import { Handler } from '../../../../../../playwright-helpers';
import organizationList from './vcd-organization.json';

export type GetOrganizationMocksParams = {
  isOrganizationKo?: boolean;
  nbOrganization?: number;
};

const findOrganiationById = (params: PathParams) =>
  organizationList.find(({ id }) => id === params.id);

export const getOrganizationMocks = ({
  isOrganizationKo,
  nbOrganization = Number.POSITIVE_INFINITY,
}: GetOrganizationMocksParams): Handler[] => [
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
      : organizationList.slice(0, nbOrganization),
    status: isOrganizationKo ? 500 : 200,
    api: 'v2',
  },
];
