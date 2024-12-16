import { PaginationState } from '@ovh-ux/manager-react-components';
import { TRegion } from '@ovh-ux/manager-pci-common';
import { nanoid } from 'nanoid';
import { VLAN_ID } from '@/pages/new/new.constants';
import { TGroupedNetwork, TNetwork } from '@/types/network.type';
import { DEFAULT_CIDR } from '@/constants';

const getDate = () => {
  const date = new Date();
  return `${date.getDate()}${date.getMonth() + 1}`;
};

export const getAutoGeneratedName = (prefix = ''): string => {
  const date = getDate();
  const randomNumber = nanoid(5);
  const prefixPart = prefix ? `${prefix}-` : '';

  return `${prefixPart}${date}-${randomNumber}`;
};

export function getNextAvailableVlanId(allocatedIds: number[]): number {
  const set = new Set(allocatedIds);

  for (let i = 1; i <= VLAN_ID.max; i += 1) {
    if (!set.has(i)) {
      return i;
    }
  }

  return VLAN_ID.default;
}

export const getDefaultCIDR = (vlanId: number) =>
  DEFAULT_CIDR.replace('{vlanId}', `${vlanId % 255}`);

export const getLocalZoneRegions = (regions: TRegion[] = []) =>
  regions?.filter(({ type }) => type.includes('localzone')) || [];

type GroupedVlanId = {
  vlanId: number;
  name: string;
  regions: string[];
};

export const groupedPrivateNetworkByVlanId = (
  networks: TNetwork[],
): TGroupedNetwork[] => {
  const grouped = networks.reduce((acc, item) => {
    if (item.vlanId) {
      if (!acc[item.vlanId]) {
        acc[item.vlanId] = {
          vlanId: item.vlanId,
          name: item.name,
          regions: [],
        };
      }
      acc[item.vlanId].regions.push(item.region);
    }
    return acc;
  }, {} as { [key: number]: GroupedVlanId });

  return Object.values(grouped).map(({ vlanId, name, regions }) => ({
    vlanId,
    name,
    regions,
    search: `${vlanId} ${name} ${regions.join(' ')}`,
  }));
};

export const paginateResults = <T>(
  items: T[],
  pagination: PaginationState,
) => ({
  rows: items.slice(
    pagination.pageIndex * pagination.pageSize,
    (pagination.pageIndex + 1) * pagination.pageSize,
  ),
  pageCount: Math.ceil(items.length / pagination.pageSize),
  totalRows: items.length,
});
