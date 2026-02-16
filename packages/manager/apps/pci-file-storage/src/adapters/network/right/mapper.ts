import { TNetworkDto, TSubnetDto } from '@/adapters/network/right/dto.type';
import { TNetwork, TSubnet } from '@/domain/entities/network.entity';

export const mapNetworkDtoToNetwork = (dto: TNetworkDto): TNetwork => ({
  id: dto.id,
  name: dto.name,
  region: dto.region,
  visibility: dto.visibility,
  vlanId: dto.vlanId,
});

export const mapSubnetDtoToSubnet = (dto: TSubnetDto): TSubnet => ({
  id: dto.id,
  name: dto.name,
});
