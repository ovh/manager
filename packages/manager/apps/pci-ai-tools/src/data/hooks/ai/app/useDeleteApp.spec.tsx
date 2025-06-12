import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as appApi from '@/data/api/ai/app/app.api';
import { useDeleteApp } from './useDeleteApp.hook';

vi.mock('@/data/api/ai/app/app.api', () => ({
  deleteApp: vi.fn(),
}));

describe('useDeleteApp', () => {
  it('should delete a App', async () => {
    const projectId = 'projectId';
    const appId = 'appId';
    const onDeleteSuccess = vi.fn();
    const onError = vi.fn();

    vi.mocked(appApi.deleteApp).mockResolvedValue(undefined);

    const { result } = renderHook(
      () => useDeleteApp({ onError, onDeleteSuccess }),
      {
        wrapper: QueryClientWrapper,
      },
    );

    const deleteAppProps = {
      projectId,
      appId,
    };
    result.current.deleteApp(deleteAppProps);

    await waitFor(() => {
      expect(appApi.deleteApp).toHaveBeenCalledWith(deleteAppProps);
    });
  });
});
