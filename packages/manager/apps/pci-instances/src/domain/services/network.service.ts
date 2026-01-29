import { format } from 'date-fns';
import { TPrivateNetwork } from '@/domain/entities/configuration';

const VLAN_ID_MAX = 4000;

const getNextAvailableVlanId = (allocatedIds: number[]): number => {
  const set = new Set(allocatedIds);

  return (
    Array.from({ length: VLAN_ID_MAX }, (_, idx) => idx + 1).find(
      (id) => !set.has(id),
    ) || 1
  );
};

export const getOvhPrivateNetwork = (
  region: string,
  privateNetworks: TPrivateNetwork,
) => {
  const { networks } = privateNetworks;

  const allocatedVlanIds = networks.allIds
    .map((networkId) => networks.byId.get(networkId)?.vlanId ?? null)
    .filter((vlanId) => vlanId !== null);

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
