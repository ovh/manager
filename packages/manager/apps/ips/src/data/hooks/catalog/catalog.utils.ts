import {
  isRegionInEu,
  isRegionInUs,
} from '@/components/RegionSelector/region-selector.utils';
import { CatalogIpPlan } from '../../api/catalog';

export const getContinentKeyFromRegion = (region: string) => {
  if (isRegionInEu(region)) return 'EU';
  if (isRegionInUs(region)) return 'US';
  return 'CA';
};

export const DATACENTER_TO_REGION: { [datacenter: string]: string } = {
  RBX: 'eu-west-rbx',
  GRA: 'eu-west-gra',
  SBG: 'eu-west-sbg',
  PAR: 'eu-west-par',
  CR2: 'labeu-west-1-preprod',
  LIM: 'eu-west-lim',
  // Keep it after LIM
  DE: 'eu-west-lim',
  WAW: 'eu-central-waw',
  ERI: 'eu-west-eri',
  // Keep it after ERI
  UK: 'eu-west-eri',
  BHS: 'ca-east-bhs',
  YYZ: 'ca-east-tor',
  SGP: 'ap-southeast-sgp',
  SYD: 'ap-southeast-syd',
  YNM: 'ap-south-mum',
  VIN: 'us-east-vin',
  HIL: 'us-west-hil',
};

export const getDatacenterFromRegion = (inputRegion: string) =>
  Object.entries(DATACENTER_TO_REGION)
    .filter(([, region]) => region === inputRegion)
    .map(([datacenter]) => datacenter)?.[0];

export const getCatalogIpsQueryKey = (sub: string) => ['getCatalogIps', sub];

export const isBlockIpPlan = (plan: CatalogIpPlan) => {
  const defaultPricing = plan.details.pricings.default[0];
  return (
    defaultPricing.capacities.includes('renew') &&
    defaultPricing.maximumQuantity === 1
  );
};

export const isAdditionalIpPlan = (plan: CatalogIpPlan) => !isBlockIpPlan(plan);
