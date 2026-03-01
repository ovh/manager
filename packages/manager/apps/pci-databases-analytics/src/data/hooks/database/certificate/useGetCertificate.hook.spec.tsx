import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { useGetCertificate } from './useGetCertificate.hook';
import * as databaseAPI from '@/data/api/database/certificate.api';
import * as database from '@/types/cloud/project/database';
import { QueryClientWrapper } from '@/__tests__/helpers/wrappers/QueryClientWrapper';

vi.mock('@/data/api/database/certificate.api', () => ({
  getCertificate: vi.fn(),
}));

describe('useGetCertificates', () => {
  it('should return certificate', async () => {
    const projectId = 'projectId';
    const engine = database.EngineEnum.mysql;
    const serviceId = 'serviceId';
    const mockData = { ca: 'certificateCA' };

    vi.mocked(databaseAPI.getCertificate).mockResolvedValue(mockData);

    const { result } = renderHook(
      () => useGetCertificate(projectId, engine, serviceId),
      { wrapper: QueryClientWrapper },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
      expect(result.current.data).toEqual(mockData);
      expect(databaseAPI.getCertificate).toHaveBeenCalledWith({
        projectId,
        engine,
        serviceId,
      });
    });
  });
});
