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

export const selectAggregatedInstanceForActionModal = (
  instance?: TAggregatedInstanceDto,
): TInstanceActionModalViewModel => {
  if (!instance) return null;
  return {
    id: instance.id,
    name: instance.name,
    isImageDeprecated: instance.isImageDeprecated,
    ip: instance.addresses[0].ip,
    region: instance.region,
    imageId: instance.imageId,
  };
};

const mapAggregatedInstanceDto = (instance: TAggregatedInstanceDto) => ({
  isImageDeprecated: instance.isImageDeprecated,
  ip: instance.addresses[0].ip,
  region: instance.region,
  imageId: instance.imageId,
});

const mapInstance = (instance: TInstance) => ({
  isImageDeprecated: instance.image?.deprecated ?? false,
  ip: instance.addresses.values().next().value?.[0].ip ?? '',
  region: instance.region.name,
  imageId: instance.image?.id ?? '',
});

const isTInstance = (
  instance: TAggregatedInstanceDto | TInstance,
): instance is TInstance =>
  !('imageId' in instance) && Array.isArray(instance.addresses);

export const selectInstanceForActionModal = (
  instance?: TAggregatedInstanceDto | TInstance,
): TInstanceActionModalViewModel => {
  if (!instance) return null;

  const instanceActionForActionElement = isTInstance(instance)
    ? mapInstance(instance)
    : mapAggregatedInstanceDto(instance);

  return {
    id: instance.id,
    name: instance.name,
    ...instanceActionForActionElement,
  };
};
