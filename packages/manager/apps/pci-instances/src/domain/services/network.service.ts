import { format } from 'date-fns';
import { TPrivateNetwork } from '@/domain/entities/configuration';

const VLAN_ID_MAX = 4000;

const getNextAvailableVlanId = (allocatedIds: number[]): number => {
  const set = new Set(allocatedIds);

  for (let id = 1; id <= VLAN_ID_MAX; id++) {
    if (!set.has(id)) return id;
  }

  return 1;
};

export const getOvhPrivateNetwork = (
  region: string,
  privateNetworks: TPrivateNetwork,
) => {
  const { networks } = privateNetworks;

  const allocatedVlanIds = networks.allIds
    .map((networkId) => networks.byId.get(networkId)?.vlanId ?? null)
    .filter((vlanId): vlanId is number => vlanId !== null);

  const vlanId = getNextAvailableVlanId(allocatedVlanIds);

  const formattedDate = format(new Date(), 'ddMMyyyy');
  const name = `pn-${region}-${formattedDate}`;

  const cidr = `10.${vlanId % 255}.0.0/16`;

  return {
    name,
    vlanId,
    cidr,
    enableDhcp: true,
  };
};
