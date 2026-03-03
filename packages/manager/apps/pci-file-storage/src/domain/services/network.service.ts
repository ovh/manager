import { TNetwork } from '@/domain/entities/network.entity';

export const getPrivateNetworks = (networks: TNetwork[]): TNetwork[] =>
  networks.filter((network) => network.visibility === 'private');
