import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchIcebergV2, v2, v6 } from '@ovh-ux/manager-core-api';
import {
  attachBasicIp,
  createBasicIp,
  detachBasicIp,
  getAllBasicIp,
  terminateBasicIp,
} from './basic-ip';

vi.mock('@ovh-ux/manager-core-api', () => ({
  v2: {
    post: vi.fn(() => Promise.resolve({ data: {} })),
    delete: vi.fn(() => Promise.resolve({ data: {} })),
  },
  v6: {
    post: vi.fn(() => Promise.resolve({ data: {} })),
  },
  fetchIcebergV2: vi.fn(),
}));

const projectId = 'project-id';
const ip = '203.0.113.42';

describe('basic ip api', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('attach', () => {
    it('posts the instance to the regional extnet route', async () => {
      await attachBasicIp({
        projectId,
        regionName: 'GRA11',
        ip,
        instanceId: 'instance-id',
      });

      expect(
        v6.post,
      ).toHaveBeenCalledWith(
        `/cloud/project/${projectId}/region/GRA11/ip/extnet/${ip}/attach`,
        { instanceId: 'instance-id' },
      );
    });
  });

  describe('detach', () => {
    it('posts to the regional extnet route without a body', async () => {
      await detachBasicIp({ projectId, regionName: 'GRA11', ip });

      expect(v6.post).toHaveBeenCalledWith(
        `/cloud/project/${projectId}/region/GRA11/ip/extnet/${ip}/detach`,
      );
    });
  });

  describe('create', () => {
    it('sends only the region when no availability zone is chosen', async () => {
      await createBasicIp({ projectId, regionName: 'GRA11' });

      expect(
        v2.post,
      ).toHaveBeenCalledWith(
        `/publicCloud/project/${projectId}/publicIp/extNet`,
        { targetSpec: { location: { region: 'GRA11' } } },
      );
    });

    it('sends the availability zone when one is chosen', async () => {
      await createBasicIp({
        projectId,
        regionName: 'EU-WEST-PAR',
        availabilityZone: 'eu-west-par-a',
      });

      expect(v2.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          targetSpec: expect.objectContaining({
            location: {
              region: 'EU-WEST-PAR',
              availabilityZone: 'eu-west-par-a',
            },
          }),
        }),
      );
    });

    it('associates the instance when one is chosen', async () => {
      await createBasicIp({
        projectId,
        regionName: 'GRA11',
        instanceId: 'instance-id',
      });

      expect(v2.post).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          targetSpec: expect.objectContaining({
            associatedResource: { id: 'instance-id', type: 'instance' },
          }),
        }),
      );
    });
  });

  describe('terminate', () => {
    it('deletes the ip by its address', async () => {
      await terminateBasicIp(projectId, ip);

      expect(v2.delete).toHaveBeenCalledWith(
        `/publicCloud/project/${projectId}/publicIp/extNet/${ip}`,
      );
    });
  });

  describe('listing', () => {
    it('follows the pagination cursor until it is exhausted', async () => {
      vi.mocked(fetchIcebergV2)
        .mockResolvedValueOnce({
          data: [{ id: 'first' }],
          cursorNext: 'next-cursor',
        } as never)
        .mockResolvedValueOnce({
          data: [{ id: 'second' }],
          cursorNext: null,
        } as never);

      const basicIps = await getAllBasicIp(projectId);

      expect(basicIps.map(({ id }) => id)).toEqual(['first', 'second']);
      expect(fetchIcebergV2).toHaveBeenCalledTimes(2);
      expect(vi.mocked(fetchIcebergV2).mock.calls[1][0]).toEqual(
        expect.objectContaining({ cursor: 'next-cursor' }),
      );
    });
  });
});
