import { describe, it } from 'vitest';
import {
  mockedInstancesCatalogEntity,
  mockedContinentsSelectorData,
  mockedProjectId,
  mockedAllContinentsSelectorData,
} from '@/__mocks__/instance/constants';
import { Deps } from '@/deps/deps';
import { selectContinent } from '../continentsViewModel';

const fakeDeps: Deps = {
  instancesCatalogPort: {
    selectInstancesCatalog: vi
      .fn()
      .mockReturnValue(mockedInstancesCatalogEntity),
  },
  messageProviderPort: { getMessage: vi.fn((key: string) => key) },
};

describe('selectContinents ViewModel', () => {
  it(`should return matching continents of the deployment zones with "all" preselected`, () => {
    expect(
      selectContinent(fakeDeps)(mockedProjectId, ['region', 'region-3-az']),
    ).toStrictEqual(mockedContinentsSelectorData);
  });

  it('should return all continents of the available regions with "all" preselected if no deploymentZone is selected', () => {
    expect(selectContinent(fakeDeps)(mockedProjectId, [])).toStrictEqual(
      mockedAllContinentsSelectorData,
    );
  });
});
