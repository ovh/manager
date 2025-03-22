import { Handler } from '@ovh-ux/manager-core-test-utils';

export const organisationMockList = ['ARIN-1', 'ARIN-2', 'RIPE-1', 'RIPE-2'];

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
      : organisationMockList.slice(0, nbOrganisation),
    api: 'v6',
    status: getOrganisationKo ? 400 : 200,
  },
];
