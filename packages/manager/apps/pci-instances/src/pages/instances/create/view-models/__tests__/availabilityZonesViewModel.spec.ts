import { describe } from 'vitest';
import {
  mockedInstancesCatalogEntity,
  mockedProjectId,
} from '@/__mocks__/instance/constants';
import { Deps } from '@/deps/deps';
import { selectAvailabilityZones } from '../availabilityZonesViewModel';

const fakeDeps: Deps = {
  instancesCatalogPort: {
    selectInstancesCatalog: vi
      .fn()
      .mockReturnValue(mockedInstancesCatalogEntity),
  },
  messageProviderPort: { getMessage: vi.fn((key: string) => key) },
};

describe('selectAvailabilityZones ViewModel', () => {
  type Data = {
    region: string;
    availabilityZones: string[];
  };

  describe.each`
    region                 | availabilityZones
    ${'GRA11'}             | ${[]}
    ${'GRA7'}              | ${[]}
    ${'BHS5'}              | ${[]}
    ${'EU-SOUTH-LZ-MIL-A'} | ${['eu-south-mil-a', 'eu-south-mil-b', 'eu-south-mil-c']}
    ${'EU-WEST-PAR'}       | ${['eu-west-par-a', 'eu-west-par-b', 'eu-west-par-c']}
  `('Given an input <$region>', ({ region, availabilityZones }: Data) => {
    test(`Then, expect availabilityZones to be ${availabilityZones.join(
      ' ',
    )}`, () => {
      expect(
        selectAvailabilityZones(fakeDeps)(mockedProjectId, region),
      ).toStrictEqual(availabilityZones);
    });
  });
});
