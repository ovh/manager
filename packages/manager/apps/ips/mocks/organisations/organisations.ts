import { Handler } from '@ovh-ux/manager-core-test-utils';
import { PathParams } from 'msw';

import organisationsList from './get-organisations.json';
import organisationsDetails from './get-organisations-details.json';

export type GetOrganisationMocksParams = {
  nbOrganisation?: number;
  getOrganisationKo?: boolean;
};

export const getOrganisationMocks = ({
  nbOrganisation = 4,
  getOrganisationKo = false,
}: GetOrganisationMocksParams): Handler[] => [
  {
    url: '/me/ipOrganisation',
    response: getOrganisationKo
      ? {
          message: 'Get organisation KO',
        }
      : organisationsList.slice(0, nbOrganisation),
    api: 'v6',
    status: getOrganisationKo ? 400 : 200,
  },
  {
    url: '/me/ipOrganisation/:orgId',
    response: (_: unknown, params: PathParams) => {
      return organisationsDetails.find(
        ({ organisationId }) => organisationId === params.orgId,
      );
    },
    api: 'v6',
  },
];
