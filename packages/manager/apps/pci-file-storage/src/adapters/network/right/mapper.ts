import { TNetwork } from '@/domain/entities/network.entity';

import { TNetworkDto } from './dto.type';

export const mapNetworkDtoToNetwork = (dto: TNetworkDto): TNetwork => ({
  id: dto.id,
  name: dto.name,
  region: dto.region,
  visibility: dto.visibility,
});
