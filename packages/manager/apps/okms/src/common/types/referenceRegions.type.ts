import { LocationType } from './location.type';

export type ReferenceRegion = {
  certifications: string[];
  id: string;
  kmipEndpoint: string;
  restEndpoint: string;
  type: LocationType;
};
