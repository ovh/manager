import { describe, it } from 'vitest';
import queryClient from '@/queryClient';
import { instancesCatalogQueryKey } from '@/adapters/tanstack-query/store/instances/queryKeys';
import {
  mockedDeploymentModesSelectorData,
  mockedInstancesCatalogEntity,
  mockedProjectId,
} from '@/__mocks__/instance/constants';
import { selectDeploymentModes } from '../selectDeploymentMode';

describe('SelectDeploymentMode ViewModel', () => {
  it('should return expected derived data for the view', () => {
    queryClient.setQueryData(
      instancesCatalogQueryKey(mockedProjectId),
      mockedInstancesCatalogEntity,
    );

    expect(selectDeploymentModes(mockedProjectId)).toStrictEqual(
      mockedDeploymentModesSelectorData,
    );
  });
});
