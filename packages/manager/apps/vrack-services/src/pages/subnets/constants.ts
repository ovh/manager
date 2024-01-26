export const displayNameInputName = 'displayName';
export const cidrInputName = 'cidr';
export const serviceRangeSelectName = 'serviceRange';
export const vlanInputName = 'hasVlan';
export const noVlanOptionValue = 'noVlan';
export const vlanNumberOptionValue = 'vlanNumber';
export const vlanNumberInputName = 'vlan';

export const isValidVlanNumber = (vlan: number) => vlan >= 2 && vlan <= 4094;

export const getSubnetCreationMutationKey = (id: string) =>
  `create-subnet-${id}`;
