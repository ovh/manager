import { TRegion } from '@ovh-ux/manager-pci-common';

const regions = [
  { name: 'region1', type: 'localzone' },
  { name: 'region2', type: 'region' },
  { name: 'region3', type: 'localzone' },
] as TRegion[];

const globalRegions = [
  { name: 'region1', type: 'region' },
  { name: 'region2', type: 'region' },
] as TRegion[];

export { regions, globalRegions };
