import { TVolumeDto } from '@/types/volume/api.type';
import { TVolume } from '@/types/volume/entity.type';

export const mapDtoToVolume = (dto: TVolumeDto): TVolume => ({
  ...dto,
  attachedInstances: dto.attachedTo.map(({ id }) => id),
});
