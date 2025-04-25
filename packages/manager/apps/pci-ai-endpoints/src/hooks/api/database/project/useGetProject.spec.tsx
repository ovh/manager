import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useGetProject } from '@/hooks/api/database/project/useGetProject.hook';
import { getProject } from '@/data/api/database/project.api';

vi.mock('@/data/api/database/project.api', () => ({
  getProject: vi.fn(),
}));

describe('useGetProject', () => {
  it('should return project data successfully', async () => {
    const projectId = 'projectId';
    const mockProjectData = { id: projectId, name: 'Test Project' };

    vi.mocked(getProject).mockResolvedValue(mockProjectData);

    const queryClient = new QueryClient();
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(() => useGetProject(projectId), { wrapper });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual(mockProjectData);
      expect(getProject).toHaveBeenCalledWith(projectId);
    });
  });
});
