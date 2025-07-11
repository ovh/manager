import { TNetwork } from '@/types/network/entity.type';
import { TInstanceDashboardViewModel } from './selectInstanceDashboard';

export const selectUnattachedNetwork = (
  networks: TNetwork[],
  instance?: TInstanceDashboardViewModel,
) =>
  networks.filter(
    ({ id }) =>
      !instance?.addresses
        .get('private')
        ?.find((address) => address.subnet?.network.id === id),
  );
