import { TVolumeDto } from '@/types/volume/api.type';
import { TVolume } from '@/types/volume/entity.type';

export const mapDtoToVolume = (dto: TVolumeDto): TVolume => ({
  ...dto,
  attachedInstances: dto.attachedTo.map(({ id }) => id),
  availabilityZone:
    dto.availabilityZone === 'any' ? null : dto.availabilityZone, // any is for Volume Any type which means available for any zone then it is similar to null
});
