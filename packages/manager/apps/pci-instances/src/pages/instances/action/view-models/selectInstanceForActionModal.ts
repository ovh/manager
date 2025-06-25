import { TInstanceDto } from '@/types/instance/api.type';

export type TInstanceActionModalViewModel = {
  id: string;
  name: string;
  isImageDeprecated: boolean;
  ip: string;
  region: string;
  imageId: string;
} | null;

export const selectInstanceForActionModal = (
  instance?: TInstanceDto,
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
