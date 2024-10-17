import { describe, it, expect, vi } from 'vitest';
import { v6 } from '@ovh-ux/manager-core-api';
import { deleteListener, getListener } from './listener';

describe('listener API', () => {
  const projectId = 'test-project';
  const region = 'test-region';
  const listenerId = 'test-listener';

  describe('deleteListener', () => {
    it('should delete a listener and return data', async () => {
      const mockResponse = { success: true };
      vi.mocked(v6.delete).mockResolvedValueOnce({ data: mockResponse });

      const result = await deleteListener(projectId, region, listenerId);

      expect(v6.delete).toHaveBeenCalledWith(
        `/cloud/project/${projectId}/region/${region}/loadbalancing/listener/${listenerId}`,
      );
      expect(result).toEqual(mockResponse);
    });
  });

  describe('getListener', () => {
    it('should get a listener and return data', async () => {
      const mockListener = { id: listenerId, name: 'test-listener' };
      vi.mocked(v6.get).mockResolvedValueOnce({ data: mockListener });

      const result = await getListener(projectId, region, listenerId);

      expect(v6.get).toHaveBeenCalledWith(
        `/cloud/project/${projectId}/region/${region}/loadbalancing/listener/${listenerId}`,
      );
      expect(result).toEqual(mockListener);
    });
  });
});
