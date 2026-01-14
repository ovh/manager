import { ComponentType, SVGProps } from 'react';

import { TCountryIsoCode } from '@/components/new-lib/flag/country-iso-code';
import { TDeploymentMode } from '@/domain/entities/catalog.entity';

export type TSVGImage = ComponentType<SVGProps<SVGSVGElement>>;

export type TDeploymentModeDataForCard = {
  mode: TDeploymentMode;
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
  deploymentMode: TDeploymentMode;
  countryCode: TCountryIsoCode | null;
  microRegions: TMicroRegionDataForCard[];
  available: boolean;
};

export type TContinentData = { labelKey: string; value: string };
