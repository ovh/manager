import { OKMS } from '@/types/okms.type';
import { kmsServicesMock } from '../services/services.mock';

export const okmsMock: OKMS[] = [
  {
    iam: {
      displayName: kmsServicesMock.resource.displayName,
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
