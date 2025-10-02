type ApiCardinalPoint =
  | 'CENTRAL'
  | 'EAST'
  | 'NORTH'
  | 'NORTHEAST'
  | 'NORTHWEST'
  | 'SOUTH'
  | 'SOUTHEAST'
  | 'SOUTHWEST'
  | 'WEST';

export type ApiRegion = {
  availabilityZones: string[];
  cardinalPoint: ApiCardinalPoint;
  cityCode: string;
  cityLatitude: number;
  cityLongitude: number;
  cityName: string;
  code: string;
  countryCode: string;
  countryName: string;
  geographyCode: string;
  geographyName: string;
  location: string;
  name: string;
  openingYear: number;
  specificType: 'BACKUP' | 'LZ' | 'SNC' | 'STANDARD';
  type: 'LOCAL-ZONE' | 'REGION-1-AZ' | 'REGION-3-AZ';
};
