import { TInstanceDto, TInstanceStatusDto } from '@/types/instance/api.type';
import { TInstance, TInstanceStatus } from '@/types/instance/entity.type';

export const instanceDtoBuilder = (
  addresses: TInstanceDto['addresses'],
  status: TInstanceStatusDto,
): TInstanceDto => ({
  id: `fake-id`,
  name: `fake-instance-name`,
  flavorId: `fake-flavor-id`,
  flavorName: `fake-flavor-name`,
  flavor: {
    id: 'fake-flavor-id',
    name: 'fake-flavor-name',
    specs: {
      cpu: 0,
      ram: 0,
      storage: 0,
      bandwidth: {
        public: 0,
        private: 0,
      },
    },
  },
  imageId: `fake-image-id`,
  imageName: `fake-image-name`,
  image: {
    id: 'fake-image-id',
    name: 'fake-image-name',
    deprecated: false,
  },
  region: `fake-region`,
  regionType: 'region',
  status,
  addresses,
  volumes: [],
  actions: [],
  pendingTask: false,
  prices: [
    {
      type: 'hour',
      value: 0,
      status: 'available',
    },
  ],
  sshKey: 'ssht',
  login: '',
  availabilityZone: null,
  taskState: '',
});

export const instanceBuilder = (
  instanceDto: TInstanceDto,
  addresses: TInstance['addresses'],
  status: TInstanceStatus,
): TInstance => ({
  ...instanceDto,
  addresses,
  status,
  actions: new Map(),
  taskState: null,
});
