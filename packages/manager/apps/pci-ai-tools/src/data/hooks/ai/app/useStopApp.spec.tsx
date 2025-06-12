import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as appApi from '@/data/api/ai/app/app.api';
import { AppData } from '@/data/api';
import { useStopApp } from './useStopApp.hook';

vi.mock('@/data/api/ai/app/app.api', () => ({
  stopApp: vi.fn(),
}));

describe('useStopApp', () => {
  it('should stop a App', async () => {
    const projectId = 'projectId';
    const appId = 'appId';
    const onStopSuccess = vi.fn();
    const onError = vi.fn();

    vi.mocked(appApi.stopApp).mockResolvedValue(undefined);

    const { result } = renderHook(
      () => useStopApp({ onError, onStopSuccess }),
      {
        wrapper: QueryClientWrapper,
      },
    );

    const stopAppProps: AppData = {
      projectId,
      appId,
    };

    result.current.stopApp(stopAppProps);

    await waitFor(() => {
      expect(appApi.stopApp).toHaveBeenCalledWith(stopAppProps);
      expect(onStopSuccess).toHaveBeenCalledWith();
    });
  });
});
