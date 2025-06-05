import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
import {
  useLocationByName,
  useAllLocationsByType,
  useAllCountries,
  useCityByCode,
} from './useLocation';
import { LocationType } from './location.type';

const locations = vi.hoisted(() => ({
  '3AZ': [
    {
      code: 'code1',
      name: 'name1',
      location: 'location1',
      type: 'REGION-3-AZ',
      specificType: 'STANDARD',
      cardinalPoint: 'WEST',
      openingYear: 2023,
      cityName: 'cityName1',
      cityCode: 'cityCode1',
      cityLatitude: 48.85,
      cityLongitude: 2.35,
      countryName: 'countryName1',
      countryCode: 'countryCode1',
      geographyName: 'geographyName1',
      geographyCode: 'geographyCode1',
      availabilityZones: [
        'availabilityZones11',
        'availabilityZones12',
        'availabilityZones13',
      ],
    },
    {
      code: 'code2',
      name: 'name2',
      location: 'location2',
      type: 'REGION-3-AZ',
      specificType: 'STANDARD',
      cardinalPoint: 'WEST',
      openingYear: 2007,
      cityName: 'cityName2',
      cityCode: 'cityCode2',
      cityLatitude: 50.6833333333333,
      cityLongitude: 3.18333333333333,
      countryName: 'countryName1',
      countryCode: 'countryCode1',
      geographyName: 'geographyName1',
      geographyCode: 'geographyCode1',
      availabilityZones: ['availabilityZones21'],
    },
  ],
  '1AZ': [
    {
      code: 'code3',
      name: 'name3',
      location: 'location3',
      type: 'REGION-1-AZ',
      specificType: 'STANDARD',
      cardinalPoint: 'WEST',
      openingYear: 2017,
      cityName: 'cityName3',
      cityCode: 'cityCode3',
      cityLatitude: 48.5666666666667,
      cityLongitude: 7.75,
      countryName: 'countryName1',
      countryCode: 'countryCode1',
      geographyName: 'geographyName1',
      geographyCode: 'geographyCode1',
      availabilityZones: ['availabilityZones31'],
    },
    {
      code: 'code4',
      name: 'name4',
      location: 'location4',
      type: 'REGION-1-AZ',
      specificType: 'STANDARD',
      cardinalPoint: 'WEST',
      openingYear: 2017,
      cityName: 'cityName4',
      cityCode: 'cityCode4',
      cityLatitude: 48.0333333333333,
      cityLongitude: 12.1833333333333,
      countryName: 'countryName2',
      countryCode: 'countryCode2',
      geographyName: 'geographyName1',
      geographyCode: 'geographyCode1',
      availabilityZones: ['availabilityZones41'],
    },
  ],
  LZ: [
    {
      code: 'code5',
      name: 'name5',
      location: 'location5',
      type: 'LOCAL-ZONE',
      specificType: 'STANDARD',
      cardinalPoint: 'CENTRAL',
      openingYear: 2016,
      cityName: 'cityName5',
      cityCode: 'cityCode5',
      cityLatitude: 50.8833333333333,
      cityLongitude: 21.6666666666667,
      countryName: 'countryName3',
      countryCode: 'countryCode3',
      geographyName: 'geographyName1',
      geographyCode: 'geographyCode1',
      availabilityZones: ['availabilityZones51'],
    },
    {
      code: 'code6',
      name: 'name6',
      location: 'location6',
      type: 'LOCAL-ZONE',
      specificType: 'STANDARD',
      cardinalPoint: 'CENTRAL',
      openingYear: 2016,
      cityName: 'cityName6',
      cityCode: 'cityCode6',
      cityLatitude: 50.8833333333333,
      cityLongitude: 21.6666666666667,
      countryName: 'countryName2',
      countryCode: 'countryCode2',
      geographyName: 'geographyName1',
      geographyCode: 'geographyCode1',
      availabilityZones: ['availabilityZones61'],
    },
    {
      code: 'code7',
      name: 'name7',
      location: 'location7',
      type: 'LOCAL-ZONE',
      specificType: 'STANDARD',
      cardinalPoint: 'CENTRAL',
      openingYear: 2016,
      cityName: 'cityName7',
      cityCode: 'cityCode7',
      cityLatitude: 50.8833333333333,
      cityLongitude: 21.6666666666667,
      countryName: 'countryName3',
      countryCode: 'countryCode3',
      geographyName: 'geographyName2',
      geographyCode: 'geographyCode2',
      availabilityZones: ['availabilityZones71'],
    },
  ],
}));
const shellContext = {
  shell: {
    location: {
      getLocations: () => {
        return Promise.resolve([
          ...locations['3AZ'],
          ...locations['1AZ'],
          ...locations.LZ,
        ]);
      },
    },
  },
};

const queryClient = new QueryClient();
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <ShellContext.Provider value={shellContext as unknown as ShellContextType}>
      {children}
    </ShellContext.Provider>
  </QueryClientProvider>
);

describe('useLocation', () => {
  describe('useLocationByName', () => {
    it('should return location for the given name', async () => {
      const { result } = renderHook(() => useLocationByName('name3'), {
        wrapper,
      });
      await waitFor(() => {
        expect(result.current.isFetched).toBe(true);
      });
      const { data: location } = result.current;
      expect(location).toStrictEqual({
        code: 'code3',
        name: 'name3',
        location: 'location3',
        type: 'REGION-1-AZ',
        specificType: 'STANDARD',
        cardinalPoint: 'WEST',
        openingYear: 2017,
        cityName: 'cityName3',
        cityCode: 'cityCode3',
        cityLatitude: 48.5666666666667,
        cityLongitude: 7.75,
        countryName: 'countryName1',
        countryCode: 'countryCode1',
        geographyName: 'geographyName1',
        geographyCode: 'geographyCode1',
        availabilityZones: ['availabilityZones31'],
      });
    });
  });

  describe('useAllLocationsByType', () => {
    it('should return locations matching the given type', () => {
      const { result } = renderHook(
        () => useAllLocationsByType(LocationType['1AZ']),
        {
          wrapper,
        },
      );
      const { data: allLocations } = result.current;
      expect(allLocations).toStrictEqual(locations['1AZ']);
    });
  });

  describe('useCityByCode', () => {
    it('should return the city name for the given city code', () => {
      const { result } = renderHook(() => useCityByCode('cityCode1'), {
        wrapper,
      });
      const { data: city } = result.current;
      expect(city).toStrictEqual('cityName1');
    });
  });

  describe('useAllCountries', () => {
    it('should return all distinct countries for the available locations', () => {
      const { result } = renderHook(() => useAllCountries(), {
        wrapper,
      });
      const { data: countries } = result.current;
      expect(countries).toStrictEqual([
        { code: 'countryCode1', name: 'countryName1' },
        { code: 'countryCode2', name: 'countryName2' },
        { code: 'countryCode3', name: 'countryName3' },
      ]);
    });
  });
});
