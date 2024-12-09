import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { useDeletePattern } from './useDeletePattern.hook';
import * as databaseAPI from '@/data/api/database/pattern.api';
import * as database from '@/types/cloud/project/database';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';

vi.mock('@/data/api/database/pattern.api', () => ({
  deletePattern: vi.fn(),
}));

describe('useDeletePattern', () => {
  it('should call useDeletePattern on mutation with data', async () => {
    const projectId = 'projectId';
    const engine = database.EngineEnum.opensearch;
    const serviceId = 'serviceId';
    const onSuccess = vi.fn();
    const onError = vi.fn();

    vi.mocked(databaseAPI.deletePattern).mockResolvedValue(undefined);

    const { result } = renderHook(
      () => useDeletePattern({ onError, onSuccess }),
      { wrapper: QueryClientWrapper },
    );

    const deletePatternProps = {
      projectId,
      engine,
      serviceId,
      patternId: 'patternId',
    };
    result.current.deletePattern(deletePatternProps);

    await waitFor(() => {
      expect(databaseAPI.deletePattern).toHaveBeenCalledWith(
        deletePatternProps,
      );
      expect(onSuccess).toHaveBeenCalledWith(
        undefined,
        deletePatternProps,
        undefined,
      );
    });
  });
});
