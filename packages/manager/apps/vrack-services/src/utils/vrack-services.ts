import {
  VrackServicesProductStatus,
  VrackServicesResourceStatus,
  VrackServicesWithIAM,
} from '@ovh-ux/manager-network-common';

export const isEditable = (vs?: VrackServicesWithIAM) =>
  vs?.resourceStatus === VrackServicesResourceStatus.READY &&
  [
    VrackServicesProductStatus.ACTIVE,
    VrackServicesProductStatus.DRAFT,
  ].includes(vs?.currentState.productStatus);

export const hasSubnet = (vs?: VrackServicesWithIAM) =>
  vs?.currentState.subnets.length > 0;

export const getSubnetFromCidr = (vs?: VrackServicesWithIAM, cidr?: string) =>
  vs?.currentState?.subnets.find((s) => s.cidr === cidr);

export const getDisplayName = (vs?: VrackServicesWithIAM) =>
  vs?.iam?.displayName || vs?.id;

export const isValidVlanNumber = (vlan: number) => vlan >= 2 && vlan <= 4094;
