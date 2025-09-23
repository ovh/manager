import { describe, it } from 'vitest';
import {
  mockedInstancesCatalogEntity,
  mockedLocalizationsData,
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
  translate: vi.fn((key: string) => key),
};

describe('SelectLocalizations ViewModel', () => {
  it('should return expected derived data for the view', () => {
    expect(
      selectLocalizations(fakeDeps)(
        mockedProjectId,
        ['region', 'region-3-az'],
        'western_europe',
      ),
    ).toStrictEqual(mockedLocalizationsData);
  });
});
