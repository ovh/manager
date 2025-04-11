import { describe, expect, it, vi, afterEach } from 'vitest';
import { v6 } from '@ovh-ux/manager-core-api';
import {
  getTokens,
  getToken,
  createToken,
  updateToken,
  deleteToken,
} from '@/data/api/database/token.api';

vi.mock('@ovh-ux/manager-core-api', () => ({
  v6: {
    get: vi.fn().mockResolvedValue({ data: {} }),
    post: vi.fn().mockResolvedValue({ data: {} }),
    put: vi.fn().mockResolvedValue({ data: {} }),
    delete: vi.fn().mockResolvedValue({ data: {} }),
  },
}));

describe('Token API functions', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('getTokens', () => {
    it('should call v6.get with the correct URL', async () => {
      const projectId = 'projectId';
      await getTokens({ projectId });
      expect(v6.get).toHaveBeenCalledWith(
        `/me/identity/user/ai-endpoints-user-${projectId}/token`,
      );
    });
  });

  describe('getToken', () => {
    it('should call v6.get with the correct URL', async () => {
      const projectId = 'projectId';
      const name = 'tokenName';
      await getToken({ projectId, name });
      expect(v6.get).toHaveBeenCalledWith(
        `/me/identity/user/ai-endpoints-user-${projectId}/token/${name}`,
      );
    });
  });

  describe('createToken', () => {
    it('should call v6.post with the correct URL and body', async () => {
      const projectId = 'projectId';
      const name = 'tokenName';
      const description = 'A description';
      const expiresAt = '2024-01-01T00:00:00Z';

      await createToken({ projectId, name, description, expiresAt });

      expect(v6.post).toHaveBeenCalledWith(
        `/me/identity/user/ai-endpoints-user-${projectId}/token`,
        {
          name,
          description,
          expiresAt,
        },
      );
    });

    it('should use default empty values when parameters are missing', async () => {
      const projectId = 'projectId';
      await createToken({ projectId });
      expect(v6.post).toHaveBeenCalledWith(
        `/me/identity/user/ai-endpoints-user-${projectId}/token`,
        {
          name: '',
          description: '',
          expiresAt: null,
        },
      );
    });
  });

  describe('updateToken', () => {
    it('should call v6.put with the correct URL and body', async () => {
      const projectId = 'projectId';
      const name = 'tokenName';
      const description = 'Updated description';
      const expiresAt = '2024-01-01T00:00:00Z';

      await updateToken({ projectId, name, description, expiresAt });

      expect(v6.put).toHaveBeenCalledWith(
        `/me/identity/user/ai-endpoints-user-${projectId}/token/${name}`,
        {
          description,
          expiresAt,
        },
      );
    });

    it('should use default empty values when description/expiresAt are missing', async () => {
      const projectId = 'projectId';
      const name = 'tokenName';
      await updateToken({ projectId, name, description: '', expiresAt: '' });
      expect(v6.put).toHaveBeenCalledWith(
        `/me/identity/user/ai-endpoints-user-${projectId}/token/${name}`,
        {
          description: '',
          expiresAt: null,
        },
      );
    });
  });

  describe('deleteToken', () => {
    it('should call v6.delete with the correct URL', async () => {
      const projectId = 'projectId';
      const name = 'tokenName';
      await deleteToken({ projectId, name });
      expect(v6.delete).toHaveBeenCalledWith(
        `/me/identity/user/ai-endpoints-user-${projectId}/token/${name}`,
      );
    });
  });
});
