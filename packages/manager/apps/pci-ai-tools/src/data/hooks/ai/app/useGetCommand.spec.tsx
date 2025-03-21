import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as appApi from '@/data/api/ai/app/app.api';
import { useGetCommand } from './useGetCommand.hook';
import { mockedCommand } from '@/__tests__/helpers/mocks/shared/command';
import { mockedAppSpec } from '@/__tests__/helpers/mocks/app/app';
import { AddApp } from '@/data/api/ai/app/app.api';

vi.mock('@/data/api/ai/app/app.api', () => ({
  getCommand: vi.fn(),
}));

describe('useGetCommand', () => {
  it('should return CLI Command', async () => {
    const projectId = 'projectId';

    const onSuccess = vi.fn();
    const onError = vi.fn();

    vi.mocked(appApi.getCommand).mockResolvedValue(mockedCommand);
    const { result } = renderHook(() => useGetCommand({ onError, onSuccess }), {
      wrapper: QueryClientWrapper,
    });

    const addAppProps: AddApp = {
      projectId,
      appInfo: mockedAppSpec,
    };
    result.current.getCommand(addAppProps);

    await waitFor(() => {
      expect(appApi.getCommand).toHaveBeenCalledWith(addAppProps);
      expect(onSuccess).toHaveBeenCalledWith(
        mockedCommand,
        addAppProps,
        undefined,
      );
    });
  });
});
