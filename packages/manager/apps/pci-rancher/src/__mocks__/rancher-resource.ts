import { TRancherPricing, RancherPlan, RancherVersion } from '@/types/api.type';

export const rancherPlansPricing: TRancherPricing[] = [
  {
    name: 'OVHCLOUD_EDITION',
    hourlyPrice: 0.00685,
    monthlyPrice: 4.932,
  },
  {
    name: 'STANDARD',
    hourlyPrice: 0.0171,
    monthlyPrice: 12.312,
  },
];

export const rancherPlan: RancherPlan[] = [
  {
    name: 'OVHCLOUD_EDITION',
    status: 'UNAVAILABLE',
  },
  {
    name: 'STANDARD',
    status: 'AVAILABLE',
  },
];

export const rancherVersion: RancherVersion[] = [
  {
    name: 'v2.7.4',
    status: 'AVAILABLE',
  },
  {
    name: 'v2.7.5',
    status: 'UNAVAILABLE',
    changelogUrl: 'https://changelog.ovh.com',
  },
  {
    name: 'v2.7.6',
    status: 'AVAILABLE',
    changelogUrl: 'https://changelog.ovh.com',
  },
];
