import { describe, it } from 'vitest';
import {
  mockedDeploymentModesSelectorData,
  mockedInstancesCatalogEntity,
  mockedProjectId,
} from '@/__mocks__/instance/constants';
import { selectDeploymentModes } from '../selectDeploymentMode';
import { Deps } from '@/deps/deps';

const fakeDeps: Deps = {
  store: {
    get: vi.fn().mockReturnValue(mockedInstancesCatalogEntity),
  },
};

describe('SelectDeploymentMode ViewModel', () => {
  it('should return expected derived data for the view', () => {
    expect(selectDeploymentModes(fakeDeps)(mockedProjectId)).toStrictEqual(
      mockedDeploymentModesSelectorData,
    );
  });
});
