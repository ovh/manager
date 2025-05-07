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
  imageId: `fake-image-id`,
  imageName: `fake-image-name`,
  region: `fake-region`,
  status,
  addresses,
  volumes: [],
  actions: [],
  pendingTask: false,
  availabilityZone: null,
  taskState: '',
  isImageDeprecated: false,
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
