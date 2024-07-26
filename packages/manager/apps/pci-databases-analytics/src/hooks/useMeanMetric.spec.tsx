import { describe, it, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { mockMetric } from '../__tests__/helpers/mocks/metrics';
import { useMeanMetric } from '@/hooks/useMeanMetric';
import * as database from '@/types/cloud/project/database';
import { QueryClientWrapper } from '../__tests__/helpers/wrappers/QueryClientWrapper';

vi.mock('@/data/api/database/metric.api', () => ({
  getMetric: vi.fn(() => mockMetric),
}));
describe('useMeanMetric', () => {
  it('should compute the mean of a metric', async () => {
    const { result } = renderHook(
      () =>
        useMeanMetric({
          engine: database.EngineEnum.mongodb,
          metric: 'memory',
          projectId: '123',
          serviceId: '456',
        }),
      {
        wrapper: QueryClientWrapper,
      },
    );
    await waitFor(() => {
      expect(result.current).toBe(35);
    });
  });
  it('should compute the mean of a metric using a custom transform function', async () => {
    const { result } = renderHook(
      () =>
        useMeanMetric({
          engine: database.EngineEnum.mongodb,
          metric: 'memory',
          projectId: '123',
          serviceId: '456',
          fn: (val) => val * 2,
        }),
      {
        wrapper: QueryClientWrapper,
      },
    );
    await waitFor(() => {
      expect(result.current).toBe(70);
    });
  });
});
