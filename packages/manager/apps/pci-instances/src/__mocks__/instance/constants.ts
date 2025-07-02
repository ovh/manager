import { TInstanceDto } from '@/types/instance/api.type';
import { TAggregatedInstance } from '@/types/instance/entity.type';

export const mockedInstance: TAggregatedInstance = {
  id: '12345',
  name: 'foo',
  flavorId: '678910',
  flavorName: 'b2-8',
  imageId: '11121314',
  imageName: 'linux',
  region: 'BHS',
  status: { severity: 'success', label: 'ACTIVE' },
  addresses: new Map([
    ['private', [{ ip: '123.000.00', version: 1, gatewayIp: '' }]],
    ['public', [{ ip: '777.000.00', version: 2, gatewayIp: '' }]],
  ]),
  volumes: [],
  actions: new Map(),
  pendingTask: false,
  availabilityZone: null,
  taskState: null,
  isImageDeprecated: false,
};

export const mockedInstanceWithEmptyRegion: TAggregatedInstance = {
  ...mockedInstance,
  region: '',
};

export const mockedInstanceDTO: TInstanceDto = {
  id: '54b49f74-9d56-4742-9618-89c136b0a443',
  name: 'b2-7-bhs1.preprod',
  status: 'SHUTOFF',
  addresses: [
    {
      ip: '10.3.1.17',
      version: 4,
      type: 'private',
      subnet: {
        name: 'monsubnet5',
        id: 'e09dbf37-664e-4286-a829-ba26e46d9ede',
        gatewayIP: '10.3.0.1',
        network: {
          id: 'b444f6e4-df5e-483c-b037-b61b36b8137e',
          name: 'monnetworkprive',
        },
      },
    },
    {
      ip: '15.235.69.65',
      version: 4,
      type: 'public',
      subnet: {
        name: 'Ext-Net',
        id: '63185a5f-5ed7-4778-8232-cfcd08737a7b',
        gatewayIP: '15.235.68.1',
        network: {
          id: '1cd75937-a054-4f11-8ecd-acce164a38be',
          name: 'Ext-Net',
        },
      },
    },
    {
      ip: '2607:5300:205:600::26e',
      version: 6,
      type: 'public',
      subnet: {
        name: 'Ext-Net',
        id: '144d324b-f21c-465e-be0a-7d953fcabc99',
        gatewayIP: '2607:5300:205:600::',
        network: {
          id: '1cd75937-a054-4f11-8ecd-acce164a38be',
          name: 'Ext-Net',
        },
      },
    },
  ],
  volumes: [
    {
      id: '34c94b3f-e426-466f-a382-77e9833e0094',
      name: 'testVolume1',
      size: 10,
    },
    {
      id: '82003196-51c8-4602-9847-3caaea2a12d2',
      name: 'testVOlume2',
      size: 10,
    },
  ],
  region: 'BHS1.PREPROD',
  availabilityZone: null,
  regionType: 'region',
  actions: [
    {
      name: 'details',
      group: 'details',
    },
    {
      name: 'assign_floating_ip',
      group: 'details',
    },
    {
      name: 'start',
      group: 'lifecycle',
    },
    {
      name: 'hard_reboot',
      group: 'boot',
    },
    {
      name: 'shelve',
      group: 'shelve',
    },
    {
      name: 'delete',
      group: 'delete',
    },
  ],
  pendingTask: false,
  taskState: '',
  image: {
    id: '5015bc26-5b62-4323-a27f-61575f28f306',
    name: 'Ubuntu 24.04',
    deprecated: false,
  },
  flavor: {
    id: 'b43f4b18-c9ea-401b-ae5a-0b09b5685c1b',
    name: 'b2-7',
    specs: {
      vcores: {
        value: 2,
        unit: 'Ghz',
      },
      ram: {
        value: 7000,
        unit: 'Gb',
      },
      storage: {
        value: 50,
        unit: 'Tb',
      },
      bandwidth: {
        public: {
          value: 250,
          unit: 'Mhz',
        },
        private: {
          value: 350,
          unit: 'Mhz',
        },
      },
    },
  },
  pricings: [
    {
      type: 'month',
      value: 2420000000,
      status: 'enabled',
    },
  ],
  backups: {
    count: 1,
    lastBackup: '2025-05-26T12:20:30Z',
  },
  sshKey: 'Mcbook',
  login: 'ubuntu@15.235.69.65',
} as const;
