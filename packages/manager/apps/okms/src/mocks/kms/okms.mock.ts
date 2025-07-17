import { OKMS } from '@/types/okms.type';
import {
  REGION_CA_EAST_BHS,
  REGION_EU_WEST_RBX,
  REGION_EU_WEST_SBG,
} from '../catalog/catalog.mock';

type OkmsByRegion = {
  region: string;
  okmsMock?: OKMS[];
};

export const regionWithMultipleOkms: OkmsByRegion = {
  region: REGION_EU_WEST_RBX,
  okmsMock: [
    {
      iam: {
        displayName: 'kms-roubaix-1',
        id: '5c7d984a-e0c9-4d40-942a-2b6c1a3b11b5',
        urn: 'urn:v1:eu:resource:okms:5c7d984a-e0c9-4d40-942a-2b6c1a3b11b5',
      },
      id: '2c5463d3-540a-428b-94a8-44ddb61c6e05',
      kmipEndpoint: 'eu-west-rbx.okms.ovh.net:1234',
      region: REGION_EU_WEST_RBX,
      restEndpoint: 'https://eu-west-rbx.okms.ovh.net',
      swaggerEndpoint: '"https://swagger-eu-west-rbx.okms.ovh.net',
      kmipObjectCount: 1,
      serviceKeyCount: 3,
      secretCount: 2,
    },
    {
      iam: {
        displayName: 'kms-roubaix-2',
        id: '1b4e7c8e-d1b8-4b46-a584-52c8b4b0225c',
        urn: `urn:v1:eu:resource:okms:1b4e7c8e-d1b8-4b46-a584-52c8b4b0225c`,
      },
      id: '7f3a82ac-a8d8-4c2a-ab0c-f6e86ddf6a7c',
      kmipEndpoint: 'eu-west-rbx.okms.ovh.net:1234',
      region: REGION_EU_WEST_RBX,
      restEndpoint: 'https://eu-west-rbx.okms.ovh.net',
      swaggerEndpoint: '"https://swagger-eu-west-rbx.okms.ovh.net',
      kmipObjectCount: 1,
      serviceKeyCount: 3,
      secretCount: 2,
    },
  ],
};

export const regionWithOneOkms: OkmsByRegion = {
  region: REGION_EU_WEST_SBG,
  okmsMock: [
    {
      iam: {
        displayName: 'kms-strasbourg-1',
        id: '331b05a0-2963-4f42-9e85-0474e4a5b265',
        urn: `urn:v1:eu:resource:okms:331b05a0-2963-4f42-9e85-0474e4a5b265`,
      },
      id: 'bd32045b-6d77-4514-913e-5cb044e3bccc',
      kmipEndpoint: 'eu-west-rbx.okms.ovh.net:1234',
      region: REGION_EU_WEST_SBG,
      restEndpoint: 'https://eu-west-rbx.okms.ovh.net',
      swaggerEndpoint: '"https://swagger-eu-west-rbx.okms.ovh.net',
      kmipObjectCount: 1,
      serviceKeyCount: 3,
      secretCount: 0,
    },
  ],
};

export const regionWithoutOkms: OkmsByRegion = { region: REGION_CA_EAST_BHS };

export const okmsMock: OKMS[] = [
  ...regionWithMultipleOkms.okmsMock,
  ...regionWithOneOkms.okmsMock,
];
