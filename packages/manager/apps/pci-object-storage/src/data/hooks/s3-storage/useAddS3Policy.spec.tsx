import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as s3StorageApi from '@/data/api/storage/s3Storage.api';
import storages from '@/types/Storages';
import { useAddS3Policy } from './useAddS3Policy.hook';

vi.mock('@/data/api/storage/s3Storage.api', () => ({
  addS3UserPolicy: vi.fn(),
}));

describe('useAddS3Policy', () => {
  it('should call useAddS3Policy on mutation with data', async () => {
    const onSuccess = vi.fn();
    const onError = vi.fn();

    const { result } = renderHook(
      () => useAddS3Policy({ onError, onSuccess }),
      {
        wrapper: QueryClientWrapper,
      },
    );

    result.current.addS3Policy({
      projectId: 'projectId',
      name: 's3Name',
      region: 'BHS',
      userId: 123,
      data: {
        roleName: storages.PolicyRoleEnum.admin,
      },
    });

    await waitFor(() => {
      expect(s3StorageApi.addS3UserPolicy).toHaveBeenCalledWith({
        projectId: 'projectId',
        name: 's3Name',
        region: 'BHS',
        userId: 123,
        data: {
          roleName: storages.PolicyRoleEnum.admin,
        },
      });
      expect(onSuccess).toHaveBeenCalledWith();
    });
  });
});
