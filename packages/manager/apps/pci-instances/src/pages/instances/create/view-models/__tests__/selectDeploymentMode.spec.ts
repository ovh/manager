import { describe, it } from 'vitest';
import {
  mockedDeploymentModesSelectorData,
  mockedInstancesCatalogEntity,
  mockedProjectId,
} from '@/__mocks__/instance/constants';
import { selectDeploymentModes } from '../selectDeploymentMode';
import { Deps } from '@/deps/deps';

const fakeDeps: Deps = {
  instancesCatalogPort: {
    selectInstancesCatalog: vi
      .fn()
      .mockReturnValue(mockedInstancesCatalogEntity),
  },
  translate: vi.fn((key: string) => key),
};

describe('SelectDeploymentMode ViewModel', () => {
  it('should return expected derived data for the view', () => {
    expect(selectDeploymentModes(fakeDeps)(mockedProjectId)).toStrictEqual(
      mockedDeploymentModesSelectorData,
    );
  });
});
