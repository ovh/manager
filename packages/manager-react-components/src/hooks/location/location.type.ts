type CardinalPoint =
  | 'CENTRAL'
  | 'EAST'
  | 'NORTH'
  | 'NORTHEAST'
  | 'NORTHWEST'
  | 'SOUTH'
  | 'SOUTHEAST'
  | 'SOUTHWEST'
  | 'WEST';
type SpecificType = 'BACKUP' | 'LZ' | 'SNC' | 'STANDARD';
type Type = 'LOCAL-ZONE' | 'REGION-1-AZ' | 'REGION-3-AZ';

export type Location = {
  availabilityZones: string[];
  cardinalPoint: CardinalPoint;
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
  specificType: SpecificType;
  type: Type;
};

export enum LocationType {
  '1AZ' = 'REGION-1-AZ',
  '3AZ' = 'REGION-3-AZ',
  'LZ' = 'LOCAL-ZONE',
}

export type Country = {
  code: string;
  name: string;
};
