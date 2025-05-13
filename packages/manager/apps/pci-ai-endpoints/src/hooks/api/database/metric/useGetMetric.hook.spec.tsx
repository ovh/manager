import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as databaseAPI from '@/data/api/database/metric.api';
import { useGetMetric } from './useGetMetric.hook';

// Mock the `getMetric` function from the databaseAPI
vi.mock('@/data/api/database/metric.api', () => ({
  getMetric: vi.fn(),
}));

describe('useGetMetric', () => {
  it('should return service Metric', async () => {
    const projectId = 'projectId';
    const metric = 'metric';
    const startTime = '2024-01-01T00:00:00Z';
    const endTime = '2024-01-02T00:00:00Z';

    const mockResponse = { data: 'metricData' };

    vi.mocked(databaseAPI.getMetric).mockResolvedValue(mockResponse);

    const queryClient = new QueryClient();

    const { result } = renderHook(
      () => useGetMetric(projectId, metric, startTime, endTime),
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
      expect(databaseAPI.getMetric).toHaveBeenCalledWith({
        projectId,
        metric,
        startTime,
        endTime,
      });
    });
  });
});
