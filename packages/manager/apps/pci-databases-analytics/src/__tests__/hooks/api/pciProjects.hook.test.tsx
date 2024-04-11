import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import * as API from '@/api/projects';
import { database } from '@/models/database';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import usePciProject from '@/hooks/api/pciProjects.api.hooks';
import { mockedPciProject } from '@/__tests__/helpers/mocks/pciProjects';

vi.mock('@/api/projects', () => ({
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
