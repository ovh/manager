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

type TMicroRegionDataForCard = {
  name: string;
  availabilityZones: string[];
  isActivable: boolean;
  isInMaintenance: boolean;
};

export type TRegionData = {
  cityKey: string;
  datacenterDetails: string | null;
  macroRegion: string | null;
  microRegion: string | null;
  deploymentMode: TDeploymentModeData;
  countryCode: TCountryIsoCode | null;
  microRegions: TMicroRegionDataForCard[];
  available: boolean;
};

export type TContinentData = { labelKey: string; value: string };

export type TMicroRegionData = { label: string; value: string; disabled: boolean };

export type TAvailabilityZoneData = { label: string; value: string };

export type TShareSpecData = {
  name: string;
  capacityMin: number;
  capacityMax: number;
  iopsLevel: number;
  bandwidthLevel: number;
  bandwidthUnit: string;
};
