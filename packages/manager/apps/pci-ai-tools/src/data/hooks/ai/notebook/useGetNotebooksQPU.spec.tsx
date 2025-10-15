import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as capabilitiesApi from '@/data/api/ai/capabilities/capabilities.api';
import { useGetNotebooksQPU } from './useGetNotebooksQPU.hook';
import {
  mockedCapabilitiesQPUFlavor,
  mockedNotebookWithQPU,
} from '@/__tests__/helpers/mocks/capabilities/qpuFlavor';

vi.mock('@/data/api/ai/capabilities/capabilities.api', () => ({
  getQPUFlavor: vi.fn(),
}));

describe('useGetNotebooksQPU', () => {
  it('should return notebooks with QPU detail', async () => {
    vi.mocked(capabilitiesApi.getQPUFlavor).mockResolvedValue(
      mockedCapabilitiesQPUFlavor,
    );

    const { result } = renderHook(
      () => useGetNotebooksQPU('projectId', [mockedNotebookWithQPU]),
      { wrapper: QueryClientWrapper },
    );

    await waitFor(() => {
      expect(result.current.notebooksWithQPU[0].qpuDetail).toEqual(
        mockedCapabilitiesQPUFlavor,
      );
      expect(result.current.isLoading).toBe(false);
    });
  });
});
