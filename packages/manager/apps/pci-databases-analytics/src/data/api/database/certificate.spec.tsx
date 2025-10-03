import { describe, expect, vi } from 'vitest';
import { apiClient } from '@/data/api/api.client';
import { getCertificate } from '@/data/api/database/certificate.api';
import * as database from '@/types/cloud/project/database';

vi.mock('@/data/api/api.client', () => {
  const get = vi.fn(() => {
    return Promise.resolve({ data: null });
  });
  return {
    apiClient: {
      v6: {
        get,
      },
    },
  };
});

describe('certificate service function', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should call getCertificate', async () => {
    expect(apiClient.v6.get).not.toHaveBeenCalled();
    await getCertificate({
      projectId: 'projectId',
      engine: database.EngineEnum.mongodb,
      serviceId: 'serviceId',
    });
    expect(apiClient.v6.get).toHaveBeenCalledWith(
      '/cloud/project/projectId/database/mongodb/serviceId/certificates',
    );
  });
});
