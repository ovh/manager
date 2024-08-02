import { apiClient } from '@ovh-ux/manager-core-api';
import { describe, expect, vi } from 'vitest';
import { getCertificate } from '@/api/databases/certificates';
import { database } from '@/models/database';

vi.mock('@ovh-ux/manager-core-api', () => {
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
