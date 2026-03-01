import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import * as database from '@/types/cloud/project/database';
import * as databaseAPI from '@/data/api/database/user.api';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import { mockedKafkaUserAccess } from '@/__tests__/helpers/mocks/userAccess';
import { useGetUserAccess } from './useGetUserAccess.hook';

vi.mock('@/data/api/database/user.api', () => ({
  getUserAccess: vi.fn(),
}));

describe('useGetUserAccess', () => {
  it('should return service data', async () => {
    const projectId = 'projectId';
    const engine = database.EngineEnum.kafka;
    const serviceId = 'serviceId';
    const userId = 'userId';
    vi.mocked(databaseAPI.getUserAccess).mockResolvedValue(
      mockedKafkaUserAccess,
    );

    const { result } = renderHook(
      () => useGetUserAccess(projectId, engine, serviceId, userId),
      {
        wrapper: QueryClientWrapper,
      },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual(mockedKafkaUserAccess);
      expect(databaseAPI.getUserAccess).toHaveBeenCalledWith({
        projectId,
        engine,
        serviceId,
        userId,
      });
    });
  });
});
