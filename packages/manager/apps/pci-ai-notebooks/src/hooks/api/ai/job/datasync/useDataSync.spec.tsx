import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as dataSyncApi from '@/data/api/ai/job/datasync/datasync.api';
import { useDataSync } from './useDataSync.hook';
import {
  mockedDataSync,
  mockedDataSyncSpec,
} from '@/__tests__/helpers/mocks/volume/datasync';

vi.mock('@/data/api/ai/job/datasync/datasync.api', () => ({
  dataSync: vi.fn(),
}));

describe('useDataSync', () => {
  it('should call useDataSync on mutation with data', async () => {
    const projectId = 'projectId';
    const jobId = 'jobId';
    const onSuccess = vi.fn();
    const onError = vi.fn();

    vi.mocked(dataSyncApi.dataSync).mockResolvedValue(mockedDataSync);
    const { result } = renderHook(() => useDataSync({ onError, onSuccess }), {
      wrapper: QueryClientWrapper,
    });

    const dataSyncProps = {
      projectId,
      jobId,
      dataSyncSpec: mockedDataSyncSpec,
    };
    result.current.dataSync(dataSyncProps);

    await waitFor(() => {
      expect(dataSyncApi.dataSync).toHaveBeenCalledWith(dataSyncProps);
      expect(onSuccess).toHaveBeenCalledWith(
        mockedDataSync,
        dataSyncProps,
        undefined,
      );
    });
  });
});
