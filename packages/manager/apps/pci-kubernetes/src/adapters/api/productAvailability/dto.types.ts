export type TDeploymentModeDTO = 'region-3-az' | 'region' | 'localzone';

export type TContinentCodeDTO = 'AF' | 'ASIA' | 'EU' | 'NA' | 'US';

export type TPlanCodeDTO =
  | 'mks.free.hour.consumption'
  | 'mks.standard.hour.consumption'
  | 'mks.standard.hour.consumption.3az';

export type TProductAvailabilityRegionDTO = {
  name: string;
  datacenter: string;
  continentCode: TContinentCodeDTO;
  countryCode: string;
  enabled: boolean;
  type: TDeploymentModeDTO;
  availabilityZones: string[];
};

export type TProductAvailabilityPlanDTO = {
  code: TPlanCodeDTO;
  regions: TProductAvailabilityRegionDTO[];
};

export type TProductAvailabilityResponseDTO = {
  plans: TProductAvailabilityPlanDTO[];
};
