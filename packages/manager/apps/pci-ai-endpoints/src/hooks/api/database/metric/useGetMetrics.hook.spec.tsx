import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as databaseAPI from '@/data/api/database/metric.api';
import { useGetMetrics } from './useGetMetrics.hook';

vi.mock('@/data/api/database/metric.api', () => ({
  getMetrics: vi.fn(),
}));

describe('useGetMetrics', () => {
  it('should return metrics data', async () => {
    const projectId = 'projectId';
    const startTime = '2024-01-01T00:00:00Z';
    const endTime = '2024-01-02T00:00:00Z';

    const mockResponse = { data: 'metricsData' };

    vi.mocked(databaseAPI.getMetrics).mockResolvedValue(mockResponse);

    const queryClient = new QueryClient();

    const { result } = renderHook(
      () => useGetMetrics(projectId, startTime, endTime),
      {
        wrapper: ({ children }) => (
          <QueryClientProvider client={queryClient}>
            {children}
          </QueryClientProvider>
        ),
      },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual(mockResponse);
      expect(databaseAPI.getMetrics).toHaveBeenCalledWith({
        projectId,
        startTime,
        endTime,
      });
    });
  });
});
