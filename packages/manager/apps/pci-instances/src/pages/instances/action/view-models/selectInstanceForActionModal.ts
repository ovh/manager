import { TAggregatedInstanceDto } from '@/types/instance/api.type';
import { TInstance } from '@/types/instance/entity.type';

export type TInstanceActionModalViewModel = {
  id: string;
  name: string;
  isImageDeprecated: boolean;
  ip: string;
  region: string;
  imageId: string;
} | null;

const mapAggregatedInstanceDto = (instance: TAggregatedInstanceDto) => {
  const publicNetwork = instance.addresses.find(
    (address) =>
      (address.type === 'floating' || address.type === 'public') &&
      address.version === 4,
  );

  return {
    isImageDeprecated: instance.isImageDeprecated,
    ip: publicNetwork?.ip ?? '',
    region: instance.region,
    imageId: instance.imageId,
  };
};

const mapInstance = (instance: TInstance) => {
  const publicNetworks =
    instance.addresses.get('floating') ??
    instance.addresses.get('public') ??
    [];
  const ipv4 =
    publicNetworks.find((network) => network.version === 4)?.ip ?? '';

  return {
    isImageDeprecated: instance.image?.deprecated ?? false,
    ip: ipv4,
    region: instance.region.name,
    imageId: instance.image?.id ?? '',
  };
};

const isInstanceAggregated = (
  instance: TAggregatedInstanceDto | TInstance,
): instance is TAggregatedInstanceDto =>
  'imageId' in instance && Array.isArray(instance.addresses);

export const selectInstanceForActionModal = (
  instance?: TAggregatedInstanceDto | TInstance,
): TInstanceActionModalViewModel => {
  if (!instance) return null;

  const instanceActionForActionElement = isInstanceAggregated(instance)
    ? mapAggregatedInstanceDto(instance)
    : mapInstance(instance);

  return {
    id: instance.id,
    name: instance.name,
    ...instanceActionForActionElement,
  };
};
