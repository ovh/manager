import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import * as API from '@/data/api/project/project.api';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import { mockedPciProject } from '@/__tests__/helpers/mocks/project';
import usePciProject from './useGetProjects.hook';

vi.mock('@/data/api/project/project.api', () => ({
  getProject: vi.fn(),
}));

describe('useGetPciProjects', () => {
  it('should return PciProjects', async () => {
    vi.mocked(API.getProject).mockResolvedValue(mockedPciProject);

    const { result } = renderHook(() => usePciProject(), {
      wrapper: QueryClientWrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual(mockedPciProject);
    });
  });
});
