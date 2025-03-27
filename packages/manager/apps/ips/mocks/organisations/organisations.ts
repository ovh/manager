import { Handler } from '@ovh-ux/manager-core-test-utils';
import { PathParams } from 'msw';

export const organisationMockDetails = [
  {
    state: '',
    abuse_mailbox: 'test1@gmail.com',
    zip: '75017',
    address: '6',
    firstname: 'TestNAme',
    city: 'Paris',
    lastname: 'dd',
    phone: '003362788888',
    registry: 'ARIN',
    organisationId: 'ARIN_1',
    country: 'CA',
  },
  {
    organisationId: 'ARIN_2',
    address: 'Rio Gallegos',
    abuse_mailbox: 'test2@gmail.com',
    state: '',
    zip: '00000',
    lastname: 'TEST',
    city: 'Lill',
    firstname: 'testName',
    registry: 'ARIN',
    country: 'FR',
    phone: '0033607060706',
  },
  {
    address: '123',
    phone: '0033111111111',
    organisationId: 'RIPE_1',
    state: '',
    firstname: 'sdf',
    registry: 'RIPE',
    zip: '59000',
    lastname: 'sdf',
    country: 'FR',
    city: 'sdf',
    abuse_mailbox: 'test3@gmail.com',
  },
  {
    city: 'roubaix',
    zip: '59100',
    state: null,
    phone: '0033672101022',
    country: 'FR',
    address: 'ici',
    abuse_mailbox: 'test4@gmail.com',
    registry: 'RIPE',
    lastname: 'namey',
    firstname: 'namex',
    organisationId: 'RIPE_2',
  },
];

export const organisationMockList = ['ARIN_1', 'ARIN_2', 'RIPE_1', 'RIPE_2'];

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
  {
    url: '/me/ipOrganisation/:orgId',
    response: (_: unknown, params: PathParams) => {
      return organisationMockDetails.find(
        ({ organisationId }) => organisationId === params.orgId,
      );
    },
    api: 'v6',
  },
];
