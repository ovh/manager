import { describe, it } from 'vitest';
import {
  mockedInstancesCatalogEntity,
  mockedLocalizationsData,
  mockedLocalizationsDataForNoneDeploymentZoneAndAllContinents,
  mockedLocalizationsDataForSelectedDeploymentZoneAndAllContinents,
  mockedProjectId,
} from '@/__mocks__/instance/constants';
import { Deps } from '@/deps/deps';
import { selectLocalizations } from '../selectLocalizations';

const fakeDeps: Deps = {
  instancesCatalogPort: {
    selectInstancesCatalog: vi
      .fn()
      .mockReturnValue(mockedInstancesCatalogEntity),
  },
  messageProviderPort: {
    getMessage: vi.fn((key: string) => key)
  },
};

describe('SelectLocalizations ViewModel', () => {
  it('should return expected regions for the selected deployment zones & selected continent', () => {
    expect(
      selectLocalizations(fakeDeps)(
        mockedProjectId,
        ['region', 'region-3-az'],
        'western_europe',
      ),
    ).toStrictEqual(mockedLocalizationsData);
  });

  it('should return all regions for the selected deployment zones & "all" continent selected', () => {
    expect(
      selectLocalizations(fakeDeps)(
        mockedProjectId,
        ['region', 'region-3-az'],
        'all',
      ),
    ).toStrictEqual(
      mockedLocalizationsDataForSelectedDeploymentZoneAndAllContinents,
    );
  });

  it('should return all available regions for "all" continent selected and none deployment zone selected', () => {
    expect(
      selectLocalizations(fakeDeps)(mockedProjectId, [], 'all'),
    ).toStrictEqual(
      mockedLocalizationsDataForNoneDeploymentZoneAndAllContinents,
    );
  });
});
