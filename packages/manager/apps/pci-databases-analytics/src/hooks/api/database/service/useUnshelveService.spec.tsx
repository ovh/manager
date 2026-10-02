import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { useUnshelveService } from './useUnshelveService.hook';
import * as databaseAPI from '@/data/api/database/service.api';
import * as database from '@/types/cloud/project/database';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import { mockedService } from '@/__tests__/helpers/mocks/services';

vi.mock('@/data/api/database/service.api', () => ({
  unshelveService: vi.fn(),
}));

describe('useUnshelveService', () => {
  it('should call unshelveService on mutation with data', async () => {
    const onUnshelveSuccess = vi.fn();
    const onError = vi.fn();

    vi.mocked(databaseAPI.unshelveService).mockResolvedValue(mockedService);

    const { result } = renderHook(
      () => useUnshelveService({ onError, onUnshelveSuccess }),
      { wrapper: QueryClientWrapper },
    );

    const unshelveServiceProps = {
      projectId: 'projectId',
      engine: database.EngineEnum.mongodb,
      serviceId: 'serviceId',
    };
    result.current.unshelveService(unshelveServiceProps);

    await waitFor(() => {
      expect(databaseAPI.unshelveService).toHaveBeenCalledWith(
        unshelveServiceProps,
      );
      expect(onUnshelveSuccess).toHaveBeenCalledWith(mockedService);
    });
  });
});
