import { describe } from 'vitest';
import {
  mockedInstancesCatalogEntity,
  mockedProjectId,
} from '@/__mocks__/instance/constants';
import { Deps } from '@/deps/deps';
import { isMicroRegionAvailable } from '../microRegionsViewModel';

const fakeDeps: Deps = {
  instancesCatalogPort: {
    selectInstancesCatalog: vi
      .fn()
      .mockReturnValue(mockedInstancesCatalogEntity),
  },
  messageProviderPort: { getMessage: vi.fn((key: string) => key) },
};

describe('selectMicroRegionAvailability ViewModel', () => {
  type Data = {
    region: string;
    available: boolean;
  };

  describe.each`
    region                 | available
    ${'GRA11'}             | ${true}
    ${'GRA7'}              | ${true}
    ${'BHS5'}              | ${false}
    ${'EU-SOUTH-LZ-MIL-A'} | ${false}
    ${'EU-WEST-PAR'}       | ${true}
  `('Given an input <$region>', ({ region, available }: Data) => {
    test(`Then, expect the region to be ${
      available ? 'available' : 'unavailable'
    }'`, () => {
      expect(
        isMicroRegionAvailable(fakeDeps)(mockedProjectId, region),
      ).toStrictEqual(available);
    });
  });
});
