import { TNetwork } from '@/domain/entities/network.entity';

import { TPrivateNetworkData } from './network.data';

export const mapNetworkToPrivateNetworkData = (network: TNetwork): TPrivateNetworkData => ({
  label: network.name,
  value: network.id,
});
