import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as appApi from '@/data/api/ai/app/app.api';
import { mockedApp, mockedAppUpdate } from '@/__tests__/helpers/mocks/app/app';
import { useUpdateApp } from './useUpdateApp.hook';
import { UpdateApp } from '@/data/api/ai/app/app.api';

vi.mock('@/data/api/ai/app/app.api', () => ({
  updateApp: vi.fn(),
}));

describe('useUpdateApp', () => {
  it('should update an App', async () => {
    const projectId = 'projectId';
    const appId = 'appId';
    const onUpdateSuccess = vi.fn();
    const onError = vi.fn();

    vi.mocked(appApi.updateApp).mockResolvedValue(mockedApp);

    const { result } = renderHook(
      () => useUpdateApp({ onError, onUpdateSuccess }),
      {
        wrapper: QueryClientWrapper,
      },
    );

    const updateDataProps: UpdateApp = {
      projectId,
      appId,
      appInfo: mockedAppUpdate,
    };

    result.current.updateApp(updateDataProps);

    await waitFor(() => {
      expect(appApi.updateApp).toHaveBeenCalledWith(updateDataProps);
      expect(onUpdateSuccess).toHaveBeenCalledWith(mockedApp);
    });
  });
});
