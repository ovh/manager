import { describe, expect, it } from 'vitest';

import { Infrastructure, RegionType } from '@/types/infrastructures.type';
import { ALL_ZONE } from '@/utils/infrastructures.constants';
import { getZones, groupByGeographicZone } from '@/utils/infrastructures.utils';

const createMockLocationDetails = (
  geographyCode: string,
  location: string,
  name: string,
  type: RegionType,
): Infrastructure['locationDetails'] =>
  ({
    location,
    geographyCode,
    name,
    type,
  }) as Infrastructure['locationDetails'];

const defaultExtraSettings = {
  mimir: {
    configurable: {
      compactor_blocks_retention_period: {
        default: '30d',
        min: '7d',
        max: '400d',
        type: 'DURATION' as const,
      },
      max_global_series_per_user: {
        default: 1000000,
        min: 100000,
        max: 10000000,
        type: 'NUMERIC' as const,
      },
    },
  },
};

const createMockInfrastructure = (
  id: string,
  location: string,
  geographyCode: string,
  name: string,
  type: RegionType,
): Infrastructure => ({
  id,
  currentState: {
    location,
    type: 'SHARED',
    usage: 'METRICS',
    entryPoint: `xxx.metrics.ovh.com`,
    extraSettings: defaultExtraSettings,
  },
  locationDetails: createMockLocationDetails(geographyCode, location, name, type),
});

const createMockInfrastructureWithoutLocation = (id: string, location: string): Infrastructure => ({
  id,
  currentState: {
    location,
    type: 'SHARED',
    usage: 'METRICS',
    entryPoint: `yyy.metrics.ovh.com`,
    extraSettings: defaultExtraSettings,
  },
});

describe('groupByGeographicZone', () => {
  it('should group infrastructures by geographic zone', () => {
    const infrastructures: Infrastructure[] = [
      createMockInfrastructure('1', 'eu-west-sbg', 'EU', 'Europe West', 'LOCAL-ZONE'),
      createMockInfrastructure('2', 'us-east-vin', 'US', 'US East', 'REGION-1-AZ'),
      createMockInfrastructure('3', 'eu-west-gra', 'EU', 'Europe West GRA', 'REGION-3-AZ'),
    ];

    const result = groupByGeographicZone(infrastructures);

    expect(result).toEqual({
      eu: [infrastructures[0], infrastructures[2]],
      us: [infrastructures[1]],
      all: infrastructures,
    });
  });

  it('should handle mixed case geographic codes by converting to lowercase', () => {
    const infrastructures: Infrastructure[] = [
      createMockInfrastructure('1', 'ap-southeast-sgp', 'APAC', 'Asia Pacific', 'LOCAL-ZONE'),
      createMockInfrastructure('2', 'ap-east-hk', 'apac', 'Asia Pacific HK', 'REGION-1-AZ'),
    ];

    const result = groupByGeographicZone(infrastructures);

    expect(result).toEqual({
      apac: [infrastructures[0], infrastructures[1]],
      [ALL_ZONE]: infrastructures,
    });
  });

  it('should filter out infrastructures without locationDetails', () => {
    const infrastructures: Infrastructure[] = [
      createMockInfrastructure('1', 'eu-west-sbg', 'EU', 'Europe West', 'LOCAL-ZONE'),
      createMockInfrastructureWithoutLocation('2', 'us-east-vin'),
      createMockInfrastructure('3', 'ca-east-bhs', 'CA', 'Canada East', 'REGION-3-AZ'),
    ];

    const result = groupByGeographicZone(infrastructures);

    expect(result).toEqual({
      eu: [infrastructures[0]],
      ca: [infrastructures[2]],
      [ALL_ZONE]: [infrastructures[0], infrastructures[2]],
    });
    expect(result[ALL_ZONE]).toHaveLength(2);
  });

  it.each([
    {
      description: 'no infrastructures have locationDetails',
      infrastructures: [
        createMockInfrastructureWithoutLocation('1', 'eu-west-sbg'),
        createMockInfrastructureWithoutLocation('2', 'us-east-vin'),
      ],
      expected: { [ALL_ZONE]: [] },
    },
    {
      description: 'empty infrastructure array',
      infrastructures: [],
      expected: { [ALL_ZONE]: [] },
    },
    {
      description: 'undefined infrastructure array',
      infrastructures: undefined,
      expected: { [ALL_ZONE]: [] },
    },
  ])('should return only all array when $description', ({ infrastructures, expected }) => {
    const result = groupByGeographicZone(infrastructures);
    expect(result).toEqual(expected);
  });

  it('should handle single infrastructure', () => {
    const infrastructures: Infrastructure[] = [
      createMockInfrastructure('1', 'eu-west-sbg', 'EU', 'Europe West', 'LOCAL-ZONE'),
    ];

    const result = groupByGeographicZone(infrastructures);

    expect(result).toEqual({
      eu: infrastructures,
      [ALL_ZONE]: infrastructures,
    });
  });

  it('should maintain all infrastructures in all array', () => {
    const infrastructures: Infrastructure[] = [
      createMockInfrastructure('1', 'eu-west-sbg', 'EU', 'Europe West', 'LOCAL-ZONE'),
      createMockInfrastructure('2', 'us-east-vin', 'US', 'US East', 'REGION-1-AZ'),
      createMockInfrastructure('3', 'ca-east-bhs', 'CA', 'Canada East', 'REGION-3-AZ'),
    ];

    const result = groupByGeographicZone(infrastructures);

    expect(result[ALL_ZONE]).toEqual(infrastructures);
    expect(result[ALL_ZONE]).toHaveLength(3);
  });

  it.each([
    {
      description: 'same geographic zone',
      infrastructures: [
        createMockInfrastructure('1', 'eu-west-sbg', 'EU', 'Europe West SBG', 'LOCAL-ZONE'),
        createMockInfrastructure('2', 'eu-west-gra', 'EU', 'Europe West GRA', 'REGION-1-AZ'),
        createMockInfrastructure('3', 'eu-central-waw', 'EU', 'Europe Central WAW', 'REGION-3-AZ'),
      ],
      expectedZoneLength: 3,
      expectedZone: 'eu',
      expectedKeys: [ALL_ZONE, 'eu'],
    },
  ])(
    'should handle multiple infrastructures in $description',
    ({ infrastructures, expectedZoneLength, expectedZone, expectedKeys }) => {
      const result = groupByGeographicZone(infrastructures);

      expect(result[expectedZone]).toHaveLength(expectedZoneLength);
      expect(result[expectedZone]).toEqual(infrastructures);
      expect(Object.keys(result)).toEqual(expectedKeys);
    },
  );
});

describe('getZones', () => {
  it.each([
    {
      description: 'undefined',
      input: undefined,
      expected: [],
    },
  ])(
    'should return empty array when groupedInfrastructures is $description',
    ({ input, expected }) => {
      const result = getZones(input);
      expect(result).toEqual(expected);
    },
  );

  it.each([
    {
      description: 'single zone (plus ALL_ZONE)',
      infrastructures: [
        createMockInfrastructure('1', 'eu-west-sbg', 'EU', 'Europe West', 'LOCAL-ZONE'),
        createMockInfrastructure('2', 'eu-west-gra', 'EU', 'Europe West GRA', 'REGION-3-AZ'),
      ],
      expected: [ALL_ZONE, 'eu'],
    },
    {
      description: 'zones with lowercase geographic codes',
      infrastructures: [
        createMockInfrastructure('1', 'ap-southeast-sgp', 'apac', 'Asia Pacific', 'LOCAL-ZONE'),
      ],
      expected: [ALL_ZONE, 'apac'],
    },
  ])('should handle $description', ({ infrastructures, expected }) => {
    const groupedInfrastructures = groupByGeographicZone(infrastructures);
    const result = getZones(groupedInfrastructures);

    expect(result).toEqual(expected);
  });

  it('should return only ALL_ZONE when no other zones exist', () => {
    const groupedInfrastructures = groupByGeographicZone(undefined);
    const result = getZones(groupedInfrastructures);

    expect(result).toEqual([ALL_ZONE]);
  });

  it('should return zones with ALL_ZONE first', () => {
    const infrastructures: Infrastructure[] = [
      createMockInfrastructure('1', 'eu-west-sbg', 'EU', 'Europe West', 'LOCAL-ZONE'),
      createMockInfrastructure('2', 'us-east-vin', 'US', 'US East', 'REGION-1-AZ'),
      createMockInfrastructure('3', 'ca-east-bhs', 'CA', 'Canada East', 'REGION-3-AZ'),
    ];

    const groupedInfrastructures = groupByGeographicZone(infrastructures);
    const result = getZones(groupedInfrastructures);

    expect(result[0]).toBe(ALL_ZONE);
    expect(result).toHaveLength(4);
    expect(result).toContain('eu');
    expect(result).toContain('us');
    expect(result).toContain('ca');
  });

  it('should maintain ALL_ZONE first even if zones are added in different order', () => {
    const infrastructures: Infrastructure[] = [
      createMockInfrastructure('1', 'us-east-vin', 'US', 'US East', 'REGION-1-AZ'),
      createMockInfrastructure('2', 'ap-southeast-sgp', 'APAC', 'Asia Pacific', 'LOCAL-ZONE'),
      createMockInfrastructure('3', 'eu-west-sbg', 'EU', 'Europe West', 'LOCAL-ZONE'),
    ];

    const groupedInfrastructures = groupByGeographicZone(infrastructures);
    const result = getZones(groupedInfrastructures);

    expect(result[0]).toBe(ALL_ZONE);
    expect(result.length).toBeGreaterThan(1);
  });

  it('should return all zone keys from grouped infrastructures', () => {
    const infrastructures: Infrastructure[] = [
      createMockInfrastructure('1', 'eu-west-sbg', 'EU', 'Europe West', 'LOCAL-ZONE'),
      createMockInfrastructure('2', 'us-east-vin', 'US', 'US East', 'REGION-1-AZ'),
    ];

    const groupedInfrastructures = groupByGeographicZone(infrastructures);
    const result = getZones(groupedInfrastructures);

    const resultSet = new Set(result);
    const keysSet = new Set(Object.keys(groupedInfrastructures));

    expect(resultSet).toEqual(keysSet);
  });
});
