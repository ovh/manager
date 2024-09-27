import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { useAddPattern } from './useAddPattern.hook';
import * as databaseAPI from '@/data/api/database/pattern.api';
import * as database from '@/types/cloud/project/database';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import {
  mockedAddPattern,
  mockedPattern,
} from '@/__tests__/helpers/mocks/patterns';

vi.mock('@/data/api/database/pattern.api', () => ({
  addPattern: vi.fn(),
}));

describe('useAddPattern', () => {
  it('should call useAddConnectionPool on mutation with data', async () => {
    const projectId = 'projectId';
    const engine = database.EngineEnum.opensearch;
    const serviceId = 'serviceId';
    const onSuccess = vi.fn();
    const onError = vi.fn();

    vi.mocked(databaseAPI.addPattern).mockResolvedValue(mockedPattern);
    const { result } = renderHook(() => useAddPattern({ onError, onSuccess }), {
      wrapper: QueryClientWrapper,
    });

    const addPatternProps = {
      projectId,
      engine,
      serviceId,
      pattern: mockedAddPattern,
    };
    result.current.addPattern(addPatternProps);

    await waitFor(() => {
      expect(databaseAPI.addPattern).toHaveBeenCalledWith(addPatternProps);
      expect(onSuccess).toHaveBeenCalledWith(
        mockedPattern,
        addPatternProps,
        undefined,
      );
    });
  });
});
