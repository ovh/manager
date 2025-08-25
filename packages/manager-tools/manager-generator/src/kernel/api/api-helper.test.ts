import axios from 'axios';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { v2Endpoint, v2Prefix, v6Endpoint, v6Prefix } from '../../playbook/config/kernel-config';
import { fetchRootServicePaths, getApiServiceOperations, getApiTemplateData } from './api-helper';

vi.mock('axios');
const mockedAxios = axios as unknown as { get: ReturnType<typeof vi.fn> };

describe('api-fetcher', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getApiServiceOperations', () => {
    it('should fetch and normalize v2 services', async () => {
      mockedAxios.get = vi.fn().mockResolvedValueOnce({
        data: { apis: [{ path: '/iam' }, { path: '/cloud/project' }] },
      });

      const result = await getApiServiceOperations(`${v2Prefix}/iam`);
      expect(mockedAxios.get).toHaveBeenCalledWith(`${v2Endpoint}/iam.json`);
      expect(result).toEqual([{ path: '/iam' }, { path: '/cloud/project' }]);
    });

    it('should handle errors and return []', async () => {
      mockedAxios.get = vi.fn().mockRejectedValueOnce(new Error('network fail'));
      const result = await getApiServiceOperations(`${v6Prefix}/cloud`);
      expect(result).toEqual([]);
    });
  });

  describe('fetchRootServicePaths', () => {
    it('should fetch and deduplicate paths', async () => {
      mockedAxios.get = vi.fn().mockResolvedValueOnce({
        data: {
          apis: [{ path: '/cloud' }, { path: '/cloud' }, { path: '/iam' }],
        },
      });

      const result = await fetchRootServicePaths(v6Endpoint);
      expect(mockedAxios.get).toHaveBeenCalledWith(v6Endpoint);
      expect(result).toEqual(['/cloud', '/iam']);
    });

    it('should return [] on failure', async () => {
      mockedAxios.get = vi.fn().mockRejectedValueOnce(new Error('boom'));
      const result = await fetchRootServicePaths(v2Endpoint);
      expect(result).toEqual([]);
    });
  });

  describe('getApiTemplateData', () => {
    it('should resolve endpoints and count ops', async () => {
      // mock getApiServiceOperations internally
      mockedAxios.get = vi.fn().mockResolvedValue({
        data: { apis: [{ path: '/x', operations: [{}, {}] }] },
      });

      const { endpoints, v2Ops, v6Ops } = await getApiTemplateData('v2', ['/iam']);

      // one service with 2 ops
      expect(endpoints.length).toBe(1);
      expect(v2Ops + v6Ops).toBe(2);
    });
  });
});
