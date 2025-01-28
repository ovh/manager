import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as API from '@/data/api/project/project.api';
import usePciProject from '@/hooks/api/project/usePciProject.hook';

// Mock de l'API
vi.mock('@/data/api/project/project.api', () => ({
  getProject: vi.fn(),
}));

describe('usePciProject', () => {
  it('should return PciProject data', async () => {
    const mockProjectData = {
      id: '123',
      name: 'Project A',
      description: 'description',
    };

    vi.mocked(API.getProject).mockResolvedValue(mockProjectData);

    const queryClient = new QueryClient();

    const { result } = renderHook(() => usePciProject(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>
          <MemoryRouter initialEntries={['/project/123']}>
            {children}
          </MemoryRouter>
        </QueryClientProvider>
      ),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual(mockProjectData);
    });
  });
});
