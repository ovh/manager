import { PathParams } from 'msw';
import { Handler } from '../../../../../../playwright-helpers';
import { OKMS } from '@/types/okms.type';

export const okmsList: OKMS[] = [
  {
    iam: {
      displayName: 'kms-1',
      id: '1b4e7c8e-d1b8-4b46-a584-52c8b4b0225c',
      urn: `urn:v1:eu:resource:okms:1b4e7c8e-d1b8-4b46-a584-52c8b4b0225c`,
    },
    id: '7f3a82ac-a8d8-4c2a-ab0c-f6e86ddf6a7c',
    kmipEndpoint: 'eu-west-rbx.okms.ovh.net:1234',
    region: 'EU_WEST_RBX',
    restEndpoint: 'https://eu-west-rbx.okms.ovh.net',
    swaggerEndpoint: '"https://swagger-eu-west-rbx.okms.ovh.net',
  },
];

export type GetOkmsMocksParams = {
  nbOkms?: number;
};

const findOkmsById = (params: PathParams) =>
  okmsList.find(({ id }) => id === params.id);

export const getOkmsMocks = ({
  nbOkms = okmsList.length,
}: GetOkmsMocksParams): Handler[] => [
  {
    url: '/okms/resource/:id',
    response: (_: unknown, params: PathParams) => findOkmsById(params),
    status: 200,
    api: 'v2',
  },
  {
    url: '/okms/resource',
    response: okmsList.slice(0, nbOkms),
    status: 200,
    api: 'v2',
  },
];
