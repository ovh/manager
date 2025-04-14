import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as jobApi from '@/data/api/ai/job/job.api';
import { useGetCommand } from './useGetCommand.hook';
import { mockedCommand } from '@/__tests__/helpers/mocks/shared/command';
import { mockedJobSpec } from '@/__tests__/helpers/mocks/job/job';
import { AddJob } from '@/data/api/ai/job/job.api';

vi.mock('@/data/api/ai/job/job.api', () => ({
  getCommand: vi.fn(),
}));

describe('useGetCommand', () => {
  it('should return CLI Command', async () => {
    const projectId = 'projectId';

    const onSuccess = vi.fn();
    const onError = vi.fn();

    vi.mocked(jobApi.getCommand).mockResolvedValue(mockedCommand);
    const { result } = renderHook(() => useGetCommand({ onError, onSuccess }), {
      wrapper: QueryClientWrapper,
    });

    const addJobProps: AddJob = {
      projectId,
      jobInfo: mockedJobSpec,
    };
    result.current.getCommand(addJobProps);

    await waitFor(() => {
      expect(jobApi.getCommand).toHaveBeenCalledWith(addJobProps);
      expect(onSuccess).toHaveBeenCalledWith(
        mockedCommand,
        addJobProps,
        undefined,
      );
    });
  });
});
