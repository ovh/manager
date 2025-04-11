import { describe, expect, it, vi, afterEach } from 'vitest';
import { v6, v2 } from '@ovh-ux/manager-core-api';
import {
  getUserId,
  createUserId,
  getPolicy,
  createPolicy,
} from '@/data/api/policies/user.api';

vi.mock('@ovh-ux/manager-core-api', () => ({
  v6: {
    get: vi.fn().mockResolvedValue({ data: {} }),
    post: vi.fn().mockResolvedValue({ data: {} }),
  },
  v2: {
    get: vi.fn().mockResolvedValue({ data: {} }),
    post: vi.fn().mockResolvedValue({ data: {} }),
  },
}));

describe('User API functions', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('getUserId', () => {
    it('should call v6.get with the correct URL', async () => {
      const projectId = 'testProject';
      await getUserId(projectId);
      expect(v6.get).toHaveBeenCalledWith(
        `/me/identity/user/ai-endpoints-user-${projectId}`,
      );
    });
  });

  describe('createUserId', () => {
    it('should call v6.post with the correct URL, payload and headers', async () => {
      const projectId = 'testProject';
      await createUserId(projectId);
      const expectedPayload = {
        description: `A user created for AI endpoints, linked to ${projectId}`,
        email: `ai-endpoints-user-${projectId}@ovhcloud.com`,
        login: `ai-endpoints-user-${projectId}`,
        password: `${projectId}`,
        group: 'UNPRIVILEGED',
      };
      expect(v6.post).toHaveBeenCalledWith(
        '/me/identity/user',
        expectedPayload,
        { headers: { 'content-type': 'application/json' } },
      );
    });
  });

  describe('getPolicy', () => {
    it('should call v2.get with the correct URL and headers', async () => {
      await getPolicy();
      expect(v2.get).toHaveBeenCalledWith('/iam/policy', {
        headers: { accept: 'application/json' },
      });
    });
  });

  describe('createPolicy', () => {
    it('should call v2.post with the correct URL, payload and headers', async () => {
      const projectId = 'testProject';
      const urn = 'urn:example:some';
      await createPolicy(projectId, urn);
      const expectedPayload = {
        name: `call-endpoints-policy-pci-${projectId}`,
        description:
          'Policy for allowing to use AI endpoints on specific public cloud projects',
        identities: [urn],
        resources: [
          { urn: `urn:v1:eu:resource:publicCloudProject:${projectId}` },
        ],
        permissions: {
          allow: [{ action: 'publicCloudProject:ai:endpoints/call' }],
        },
      };
      expect(v2.post).toHaveBeenCalledWith('/iam/policy', expectedPayload, {
        headers: { 'content-type': 'application/json' },
      });
    });
  });
});
