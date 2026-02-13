type TPlanAvailabilityRegionDTO = {
  name: string;
};

type TPlanAvailabilityDTO = {
  code: string;
  regions: TPlanAvailabilityRegionDTO[];
};

export type TProductAvailabilityDTO = {
  plans: TPlanAvailabilityDTO[];
};
