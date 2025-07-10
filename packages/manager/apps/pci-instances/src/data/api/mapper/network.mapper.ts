import { TNetworkDto } from '@/types/network/api.type';
import { TNetwork } from '@/types/network/entity.type';

export const mapNetworkDtoToNetwork = (dto: TNetworkDto): TNetwork => {
  return {
    ...dto,
  };
};
