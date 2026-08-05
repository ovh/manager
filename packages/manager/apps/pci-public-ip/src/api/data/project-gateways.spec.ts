import { beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchIcebergV2 } from '@ovh-ux/manager-core-api';
import {
  getAllProjectGateways,
  getProjectGatewayName,
  TProjectGateway,
} from './project-gateways';

vi.mock('@ovh-ux/manager-core-api', () => ({
  fetchIcebergV2: vi.fn(),
}));

const projectId = 'project-id';

const buildGateway = (overrides: Partial<TProjectGateway> = {}) =>
  ({
    id: 'gateway-id',
    resourceStatus: 'READY',
    currentState: {
      description: null,
      externalIp: '203.0.113.1',
      location: { region: 'GRA11' },
      name: 'my-gateway',
      status: 'ACTIVE',
    },
    targetSpec: {
      description: null,
      location: { region: 'GRA11' },
      name: 'my-gateway-target',
    },
    ...overrides,
  } as TProjectGateway);

describe('project gateways api', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('listing', () => {
    it('reads the project-wide v2 gateway route', async () => {
      vi.mocked(fetchIcebergV2).mockResolvedValue({
        data: [],
        cursorNext: null,
      } as never);

      await getAllProjectGateways(projectId);

      expect(fetchIcebergV2).toHaveBeenCalledWith(
        expect.objectContaining({
          route: `/publicCloud/project/${projectId}/gateway`,
        }),
      );
    });

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

      const gateways = await getAllProjectGateways(projectId);

      expect(gateways.map(({ id }) => id)).toEqual(['first', 'second']);
      expect(fetchIcebergV2).toHaveBeenCalledTimes(2);
      expect(vi.mocked(fetchIcebergV2).mock.calls[1][0]).toEqual(
        expect.objectContaining({ cursor: 'next-cursor' }),
      );
    });
  });

  describe('name', () => {
    it('prefers the current state name', () => {
      expect(getProjectGatewayName(buildGateway())).toBe('my-gateway');
    });

    it('falls back to the target spec name while there is no current state', () => {
      expect(getProjectGatewayName(buildGateway({ currentState: null }))).toBe(
        'my-gateway-target',
      );
    });
  });
});
