import { TInstanceDto } from '@/types/instance/api';
import { TEInstance } from '@/types/instance/entity';

export const mapDtoToInstance = (dto: TInstanceDto): TEInstance => ({
  ...dto,
});
