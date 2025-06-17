import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as appApi from '@/data/api/ai/app/app.api';
import { useStartApp } from './useStartApp.hook';
import { AppData } from '@/data/api';

vi.mock('@/data/api/ai/app/app.api', () => ({
  startApp: vi.fn(),
}));

describe('useStartApp', () => {
  it('should start a App', async () => {
    const projectId = 'projectId';
    const appId = 'appId';
    const onStartSuccess = vi.fn();
    const onError = vi.fn();

    vi.mocked(appApi.startApp).mockResolvedValue(undefined);

    const { result } = renderHook(
      () => useStartApp({ onError, onStartSuccess }),
      {
        wrapper: QueryClientWrapper,
      },
    );

    const startAppProps: AppData = {
      projectId,
      appId,
    };

    result.current.startApp(startAppProps);

    await waitFor(() => {
      expect(appApi.startApp).toHaveBeenCalledWith(startAppProps);
      expect(onStartSuccess).toHaveBeenCalledWith();
    });
  });
});
