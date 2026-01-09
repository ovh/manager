import { describe, it } from 'vitest';
import {
  mockedInstancesCatalogEntity,
  mockedLocalizationsData,
  mockedLocalizationsDataForNoneDeploymentZoneAndAllContinents,
  mockedLocalizationsDataForSelectedDeploymentZoneAndAllContinents,
  mockedProjectId,
} from '@/__mocks__/instance/constants';
import { Deps } from '@/deps/deps';
import { selectLocalizations } from '../localizationsViewModel';

const fakeDeps: Deps = {
  instancesCatalogPort: {
    selectInstancesCatalog: vi
      .fn()
      .mockReturnValue(mockedInstancesCatalogEntity),
  },
  instancePort: {
    createInstance: vi.fn(),
  },
};

describe('SelectLocalizations ViewModel', () => {
  it('should return expected regions for the selected deployment zones & selected continent', () => {
    expect(
      selectLocalizations(fakeDeps)(
        mockedProjectId,
        ['region', 'region-3-az'],
        'western_europe',
        'total',
      ),
    ).toStrictEqual({
      localizations: mockedLocalizationsData,
    });
  });

  it('should return all regions for the selected deployment zones & "all" continent selected', () => {
    expect(
      selectLocalizations(fakeDeps)(
        mockedProjectId,
        ['region', 'region-3-az'],
        'all',
        'total',
      ),
    ).toStrictEqual({
      localizations: mockedLocalizationsDataForSelectedDeploymentZoneAndAllContinents,
    });
  });

  it('should return all available regions for "all" continent selected and none deployment zone selected', () => {
    expect(
      selectLocalizations(fakeDeps)(mockedProjectId, [], 'all', 'total'),
    ).toStrictEqual({
      localizations: mockedLocalizationsDataForNoneDeploymentZoneAndAllContinents,
    });
  });
});
