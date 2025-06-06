import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as appApi from '@/data/api/ai/app/app.api';
import { mockedApp, mockedAppSpec } from '@/__tests__/helpers/mocks/app/app';
import { useAddApp } from './useAddApp.hook';

vi.mock('@/data/api/ai/app/app.api', () => ({
  addApp: vi.fn(),
}));

describe('useAddApp', () => {
  it('should create a app', async () => {
    const onSuccess = vi.fn();
    const onError = vi.fn();

    vi.mocked(appApi.addApp).mockResolvedValue(mockedApp);

    const { result } = renderHook(() => useAddApp({ onError, onSuccess }), {
      wrapper: QueryClientWrapper,
    });

    result.current.addApp(mockedAppSpec);

    await waitFor(() => {
      expect(appApi.addApp).toHaveBeenCalledWith({
        projectId: undefined,
        appInfo: mockedAppSpec,
      });
      expect(onSuccess).toHaveBeenCalledWith(mockedApp);
    });
  });
});
