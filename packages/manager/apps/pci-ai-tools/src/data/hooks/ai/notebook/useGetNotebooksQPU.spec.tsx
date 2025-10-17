import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import * as capabilitiesApi from '@/data/api/ai/capabilities/capabilities.api';
import { useGetNotebooksQpu } from './useGetNotebooksQpu.hook';
import {
  mockedCapabilitiesQpuFlavor,
  mockedNotebookWithQpu,
} from '@/__tests__/helpers/mocks/capabilities/qpuFlavor';

vi.mock('@/data/api/ai/capabilities/capabilities.api', () => ({
  getQpuFlavor: vi.fn(),
}));

describe('useGetNotebooksQpu', () => {
  it('should return notebooks with QPU detail', async () => {
    vi.mocked(capabilitiesApi.getQpuFlavor).mockResolvedValue(
      mockedCapabilitiesQpuFlavor,
    );

    const { result } = renderHook(
      () => useGetNotebooksQpu('projectId', [mockedNotebookWithQpu]),
      { wrapper: QueryClientWrapper },
    );

    await waitFor(() => {
      expect(result.current.notebooksWithQpu[0].qpuDetail).toEqual(
        mockedCapabilitiesQpuFlavor,
      );
      expect(result.current.isLoading).toBe(false);
    });
  });
});
