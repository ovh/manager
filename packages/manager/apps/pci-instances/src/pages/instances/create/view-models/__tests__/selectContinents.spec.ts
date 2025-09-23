import { describe, it } from 'vitest';
import {
  mockedInstancesCatalogEntity,
  mockedContinentsSelectorData,
  mockedProjectId,
} from '@/__mocks__/instance/constants';
import { Deps } from '@/deps/deps';
import { selectContinentData } from '../selectContinents';

const fakeDeps: Deps = {
  instancesCatalogPort: {
    selectInstancesCatalog: vi
      .fn()
      .mockReturnValue(mockedInstancesCatalogEntity),
  },
  translate: vi.fn((key: string) => key),
};

describe('selectContinents ViewModel', () => {
  it('should return expected derived data for the view', () => {
    expect(
      selectContinentData(fakeDeps)(mockedProjectId, ['region', 'region-3-az']),
    ).toStrictEqual(mockedContinentsSelectorData);
  });
});
