import { describe, expect, it } from 'vitest';

import {
  LOCATION_AF_NORTH_RBA,
  LOCATION_AP_SOUTHEAST_SGP,
  LOCATION_CA_EAST_BHS,
  LOCATION_EU_WEST_GRA,
  LOCATION_EU_WEST_PAR,
  LOCATION_US_WEST_LAX,
} from '@/common/mocks/locations/locations.mock';
import { Location } from '@/common/types/location.type';

import {
  CONTINENT_CODES,
  getContinentCodeFromGeographyCode,
  groupLocationsByContinent,
} from './continents';

describe('getContinentCodeFromGeographyCode', () => {
  it.each([
    ['eu', CONTINENT_CODES.EUROPE],
    ['ca', CONTINENT_CODES.NORTH_AMERICA],
    ['us', CONTINENT_CODES.NORTH_AMERICA],
    ['ap', CONTINENT_CODES.ASIA],
    ['af', CONTINENT_CODES.AFRICA],
    ['unknown', CONTINENT_CODES.OTHERS],
    ['', CONTINENT_CODES.OTHERS],
  ])('should return %s for %s geography code', (geographyCode, expectedContinent) => {
    expect(getContinentCodeFromGeographyCode(geographyCode)).toBe(expectedContinent);
  });
});

describe('groupLocationsByContinent', () => {
  const UNKNOWN_LOCATION_MOCK: Location = {
    ...LOCATION_EU_WEST_PAR,
    code: 'unknown',
    geographyCode: 'unknown',
  };

  it('should return empty objects for empty locations array', () => {
    const result = groupLocationsByContinent([]);
    expect(result.locationsByContinent).toEqual({});
    expect(result.continents).toEqual([]);
  });

  it('should group multiple locations from the same continent', () => {
    const result = groupLocationsByContinent([LOCATION_EU_WEST_PAR, LOCATION_EU_WEST_GRA]);

    expect(result.locationsByContinent).toEqual({
      [CONTINENT_CODES.EUROPE]: [LOCATION_EU_WEST_PAR, LOCATION_EU_WEST_GRA],
    });
    expect(result.continents).toEqual([CONTINENT_CODES.EUROPE]);
  });

  it('should group locations from different continents', () => {
    const result = groupLocationsByContinent([
      LOCATION_EU_WEST_PAR,
      LOCATION_CA_EAST_BHS,
      LOCATION_AP_SOUTHEAST_SGP,
    ]);

    expect(result.locationsByContinent).toEqual({
      [CONTINENT_CODES.EUROPE]: [LOCATION_EU_WEST_PAR],
      [CONTINENT_CODES.NORTH_AMERICA]: [LOCATION_CA_EAST_BHS],
      [CONTINENT_CODES.ASIA]: [LOCATION_AP_SOUTHEAST_SGP],
    });
    expect(result.continents).toContain(CONTINENT_CODES.EUROPE);
    expect(result.continents).toContain(CONTINENT_CODES.NORTH_AMERICA);
    expect(result.continents).toContain(CONTINENT_CODES.ASIA);
    expect(result.continents).toHaveLength(3);
  });

  it('should handle locations with unknown geography codes (OTHERS)', () => {
    const result = groupLocationsByContinent([LOCATION_EU_WEST_PAR, UNKNOWN_LOCATION_MOCK]);

    expect(result.locationsByContinent).toEqual({
      EUROPE: [LOCATION_EU_WEST_PAR],
      OTHERS: [UNKNOWN_LOCATION_MOCK],
    });
    expect(result.continents).toContain(CONTINENT_CODES.EUROPE);
    expect(result.continents).toContain(CONTINENT_CODES.OTHERS);
    expect(result.continents).toHaveLength(2);
  });

  it('should handle all geography code mappings correctly', () => {
    const result = groupLocationsByContinent([
      LOCATION_EU_WEST_PAR,
      LOCATION_CA_EAST_BHS,
      LOCATION_AF_NORTH_RBA,
      LOCATION_AP_SOUTHEAST_SGP,
      LOCATION_US_WEST_LAX,
      UNKNOWN_LOCATION_MOCK,
    ]);

    expect(result.locationsByContinent).toEqual({
      EUROPE: [LOCATION_EU_WEST_PAR],
      NORTH_AMERICA: [LOCATION_CA_EAST_BHS, LOCATION_US_WEST_LAX],
      ASIA: [LOCATION_AP_SOUTHEAST_SGP],
      AFRICA: [LOCATION_AF_NORTH_RBA],
      OTHERS: [UNKNOWN_LOCATION_MOCK],
    });
    expect(result.continents).toContain(CONTINENT_CODES.EUROPE);
    expect(result.continents).toContain(CONTINENT_CODES.NORTH_AMERICA);
    expect(result.continents).toContain(CONTINENT_CODES.ASIA);
    expect(result.continents).toContain(CONTINENT_CODES.AFRICA);
    expect(result.continents).toContain(CONTINENT_CODES.OTHERS);
    expect(result.continents).toHaveLength(5);
  });
});
