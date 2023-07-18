import {
  VrackServices,
  ProductStatus,
  ResoureceStatus,
} from '../../src/api/api.type';

export const firstVs: VrackServices = {
  checksum: 'd41d8cd98f00b204e9800998ecf8427e',
  createdAt: '2023-03-10T12:00:00Z',
  currentState: {
    displayName: null,
    productStatus: ProductStatus.DRAFT,
    subnets: [],
    vrackId: null,
    zone: 'LIM',
  },
  currentTasks: [],
  id: 'vrs-ahc-fw4-od1-efq',
  resourceStatus: ResoureceStatus.READY,
  targetSpec: {
    displayName: null,
    subnets: [],
  },
  updatedAt: '2023-03-10T12:00:00Z',
};

export const secondVs: VrackServices = {
  checksum: '4c5d68ea2231e90db7495406018a0f5e',
  createdAt: '2023-03-10T10:00:00Z',
  currentState: {
    displayName: 'My.vRack.Services',
    productStatus: ProductStatus.DRAFT,
    subnets: [
      {
        cidr: '192.168.0.0/16',
        displayName: 'My.Subnet',
        serviceEndpoints: [
          {
            endpoints: [
              {
                description: 'Nominal',
                ip: '192.168.0.5',
              },
            ],
            managedServiceURN:
              'urn:v1:eu:resource:storageNetApp:examples-00e1-4a3d-ae89-ac145675c8bb',
          },
          {
            endpoints: [
              {
                description: '',
                ip: '192.168.0.2',
              },
            ],
            managedServiceURN:
              'urn:v1:eu:resource:storageNetApp:examples-a77c-478e-93ce-06aa94cbd9d1',
          },
        ],
        serviceRange: {
          cidr: '192.168.0.0/29',
          remainingIps: 1,
          reservedIps: 5,
          usedIps: 2,
        },
        vlan: 30,
      },
    ],
    vrackId: null,
    zone: 'GRA',
  },
  currentTasks: [],
  id: 'vrs-ar7-72w-poh-3qe',
  resourceStatus: ResoureceStatus.READY,
  targetSpec: {
    displayName: 'My.vRack.Services',
    subnets: [
      {
        cidr: '192.168.0.0/16',
        displayName: 'My.Subnet',
        serviceEndpoints: [
          {
            managedServiceURN:
              'urn:v1:eu:resource:storageNetApp:examples-00e1-4a3d-ae89-ac145675c8bb',
          },
          {
            managedServiceURN:
              'urn:v1:eu:resource:storageNetApp:examples-a77c-478e-93ce-06aa94cbd9d1',
          },
        ],
        serviceRange: {
          cidr: '192.168.0.0/29',
        },
        vlan: 30,
      },
    ],
  },
  updatedAt: '2023-03-10T10:10:00Z',
};

export const getVs = (nb = 0) => {
  if (nb === 0) {
    return [];
  }
  return nb === 1 ? [firstVs] : [firstVs, secondVs];
};
