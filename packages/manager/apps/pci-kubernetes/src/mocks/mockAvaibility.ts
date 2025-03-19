import * as HookModule from '@ovh-ux/manager-pci-common';
import { UseQueryResult } from '@tanstack/react-query';

export const mockAvailabilityWith3az = {
  isPending: false,
  data: {
    plans: [],
    products: [
      {
        name: 'kubernetes',
        regions: [
          {
            name: 'EU-WEST-PAR',
            datacenter: 'WAW',
            continentCode: 'EU',
            enabled: true,
            type: 'region-3-az',
            availabilityZones: [
              'eu-west-par-a',
              'eu-west-par-b',
              'eu-west-par-c',
            ],
          },
          {
            name: 'BHS5',
            datacenter: 'BHS',
            continentCode: 'NA',
            enabled: true,
            type: 'region',
            availabilityZones: [],
          },
          {
            name: 'DE1',
            datacenter: 'DE',
            continentCode: 'EU',
            enabled: true,
            type: 'region',
            availabilityZones: [],
          },
          {
            name: 'GRA-STAGING-A',
            datacenter: 'GRA',
            continentCode: 'EU',
            enabled: true,
            type: 'region',
            availabilityZones: [],
          },
          {
            name: 'GRA11',
            datacenter: 'GRA',
            continentCode: 'EU',
            enabled: true,
            type: 'region',
            availabilityZones: [],
          },
          {
            name: 'GRA7',
            datacenter: 'GRA',
            continentCode: 'EU',
            enabled: true,
            type: 'region',
            availabilityZones: [],
          },
          {
            name: 'GRA9',
            datacenter: 'GRA',
            continentCode: 'EU',
            enabled: true,
            type: 'region',
            availabilityZones: [],
          },
          {
            name: 'SBG5',
            datacenter: 'SBG',
            continentCode: 'EU',
            enabled: true,
            type: 'region',
            availabilityZones: [],
          },
          {
            name: 'SGP1',
            datacenter: 'SGP',
            continentCode: 'ASIA',
            enabled: true,
            type: 'region',
            availabilityZones: [],
          },
          {
            name: 'SYD1',
            datacenter: 'SYD',
            continentCode: 'ASIA',
            enabled: true,
            type: 'region',
            availabilityZones: [],
          },
          {
            name: 'UK1',
            datacenter: 'UK',
            continentCode: 'EU',
            enabled: true,
            type: 'region',
            availabilityZones: [],
          },
          {
            name: 'WAW1',
            datacenter: 'WAW',
            continentCode: 'EU',
            enabled: true,
            type: 'region',
            availabilityZones: [],
          },
        ],
      },
    ],
  },
};

const handler = {
  get(target: any, prop: string) {
    if (prop === 'useProductAvailability') {
      return () => mockAvailabilityWith3az;
    }
    return target[prop];
  },
};

export const mockedModule: {
  useProductAvailability: (
    projectId: string,
    filter?: HookModule.ProductAvailabilityFilter,
  ) => UseQueryResult<HookModule.TProductAvailability, Error>;
} = new Proxy(HookModule, handler);

export default mockedModule.useProductAvailability;
