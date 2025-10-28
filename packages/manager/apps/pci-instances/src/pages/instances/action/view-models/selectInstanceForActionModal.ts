import { TAggregatedInstanceDto } from '@/types/instance/api.type';
import { TInstance, TInstanceAddress } from '@/types/instance/entity.type';

export type TInstanceActionModalViewModel = {
  id: string;
  name: string;
  isImageDeprecated: boolean;
  ip: string;
  region: string;
  imageId: string;
} | null;

const mapAggregatedInstanceDto = (instance: TAggregatedInstanceDto) => ({
  isImageDeprecated: instance.isImageDeprecated,
  ip: instance.addresses[0]?.ip ?? '',
  region: instance.region,
  imageId: instance.imageId,
});

const mapInstance = (instance: TInstance) => ({
  isImageDeprecated: instance.image?.deprecated ?? false,
  ip:
    (instance.addresses.values().next().value as
      | TInstanceAddress[]
      | undefined)?.[0]?.ip ?? '',
  region: instance.region.name,
  imageId: instance.image?.id ?? '',
});

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
