import { TNormalizedEntity } from '@/types';

import { TContinentCode, TDeploymentMode, TMacroRegionID, TMicroRegionID } from './regions';

export type TAvailabilityMacroRegion = {
  name: string;
  deploymentMode: TDeploymentMode;
  continentCode: TContinentCode;
  microRegionIds: Array<TMicroRegionID>;
  availabilityZones: string[];
  disabled: boolean;
};

export type TAvailabilityMicroRegion = {
  name: string;
  macroRegionId: TMacroRegionID;
  disabled: boolean;
};

export const PLAN_CODES = [
  'mks.free.hour.consumption',
  'mks.free.hour.consumption.3az',
  'mks.standard.hour.consumption',
  'mks.standard.hour.consumption.3az',
] as const;
export type TPlanCode = (typeof PLAN_CODES)[number];

export type TProductAvailabilityRegions = {
  entities: {
    macroRegions: TNormalizedEntity<TMacroRegionID, TAvailabilityMacroRegion>;
    microRegions: TNormalizedEntity<TMicroRegionID, TAvailabilityMicroRegion>;
  };
  relations: {
    planRegions: Partial<Record<TPlanCode, TMacroRegionID[]>>;
  };
};
