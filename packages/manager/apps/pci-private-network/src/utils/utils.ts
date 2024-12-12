import { nanoid } from 'nanoid';
import { VLAN_ID } from '@/pages/new/new.constants';
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
