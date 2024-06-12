export const displayNameInputName = 'displayName';
export const cidrInputName = 'cidr';
export const serviceRangeSelectName = 'serviceRange';
export const vlanInputName = 'hasVlan';
export const noVlanOptionValue = 'noVlan';
export const vlanNumberOptionValue = 'vlanNumber';
export const vlanNumberInputName = 'vlan';
export const defaultCidr = '10.0.0.0/24';
export const defaultServiceRange = '10.0.0.0/29';

export const isValidVlanNumber = (vlan: number) => vlan >= 2 && vlan <= 4094;
