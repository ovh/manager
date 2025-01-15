import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import * as prometheusApi from '@/data/api/database/prometheus.api';
import * as database from '@/types/cloud/project/database';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import { useGetPrometheusData } from './useGetPrometheus.hook';

vi.mock('@/data/api/database/prometheus.api', () => ({
  getPrometheus: vi.fn(),
}));

const prometheusDataMock = {
  username: 'prometheus',
  targets: [{ host: 'host1', port: 9090 }],
};

describe('useGetPrometheus', () => {
  it('should return prometheus data', async () => {
    const projectId = 'projectId';
    const engine = database.EngineEnum.mysql;
    const serviceId = 'serviceId';

    vi.mocked(prometheusApi.getPrometheus).mockResolvedValue(
      prometheusDataMock,
    );

    const { result } = renderHook(
      () => useGetPrometheusData(projectId, engine, serviceId),
      { wrapper: QueryClientWrapper },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual(prometheusDataMock);
      expect(prometheusApi.getPrometheus).toHaveBeenCalledWith({
        projectId,
        engine,
        serviceId,
      });
    });
  });
});
