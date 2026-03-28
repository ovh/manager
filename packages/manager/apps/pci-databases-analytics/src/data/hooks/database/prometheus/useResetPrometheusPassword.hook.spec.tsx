import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import * as prometheusApi from '@/data/api/database/prometheus.api';
import * as database from '@/types/cloud/project/database';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';
import { useResetPrometheusPassword } from './useResetPrometheusPassword.hook';

vi.mock('@/data/api/database/prometheus.api', () => ({
  resetPrometheusUserPassword: vi.fn(),
}));

describe('useResetPrometheusUserPassword', () => {
  it('should call useResetPrometheusUserPassword on mutation with data', async () => {
    const projectId = 'projectId';
    const engine = database.EngineEnum.mysql;
    const serviceId = 'serviceId';
    const mockResetPasswordData = {
      username: 'prometheus',
      password: 'newPassword',
    };
    const onSuccess = vi.fn();
    const onError = vi.fn();

    vi.mocked(prometheusApi.resetPrometheusUserPassword).mockResolvedValue(
      mockResetPasswordData,
    );
    const { result } = renderHook(
      () => useResetPrometheusPassword({ onError, onSuccess }),
      { wrapper: QueryClientWrapper },
    );

    const resetPrometheusPasswordProps = {
      projectId,
      engine,
      serviceId,
    };
    result.current.resetPrometheusUserPassword(resetPrometheusPasswordProps);

    await waitFor(() => {
      expect(prometheusApi.resetPrometheusUserPassword).toHaveBeenCalledWith(
        resetPrometheusPasswordProps,
      );
      expect(onSuccess).toHaveBeenCalledWith(
        mockResetPasswordData,
        resetPrometheusPasswordProps,
        undefined,
      );
    });
  });
});
