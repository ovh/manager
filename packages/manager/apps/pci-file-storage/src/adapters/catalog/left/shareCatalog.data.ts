import { ComponentType, SVGProps } from 'react';

import { TCountryIsoCode } from '@/components/new-lib/flag/country-iso-code';

export type TSVGImage = ComponentType<SVGProps<SVGSVGElement>>;

export type TDeploymentModeData = 'region' | 'localzone' | 'region-3-az';

export type TDeploymentModeDataForCard = {
  mode: TDeploymentModeData;
  labelKey: string;
  descriptionKey: string;
  Image: TSVGImage;
};

export type TRegionData = {
  cityKey: string;
  datacenterDetails: string | null;
  macroRegion: string | null;
  deploymentMode: TDeploymentModeData;
  countryCode: TCountryIsoCode | null;
  available: boolean;
  firstAvailableMicroRegion: string | undefined;
};

export type TContinentData = { labelKey: string; value: string };

export type TMicroRegionData = { label: string; value: string; disabled: boolean };

export type TAvailabilityZoneData = { label: string; value: string };

export type TProvisionedPerformanceData = {
  iops: number;
  throughput: number;
};

export type TShareSpecData = {
  name: string;
  capacityMin: number;
  capacityMax: number;
  iopsLevel: number;
  bandwidthLevel: number;
  bandwidthUnit: string;
  calculateProvisionedPerformance: (shareSize: number) => TProvisionedPerformanceData | null;
};
