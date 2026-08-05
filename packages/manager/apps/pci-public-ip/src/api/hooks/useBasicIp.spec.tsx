import { beforeEach, describe, expect, it, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { getAllBasicIp, terminateBasicIp, TBasicIp } from '@/api/data/basic-ip';
import { TProjectGateway } from '@/api/data/project-gateways';
import { useAllBasicIp, useBasicIps, useTerminateBasicIps } from './useBasicIp';
import { useInstances } from './useInstances';
import { useProjectGateways } from './useProjectGateways';

vi.mock('@/api/data/basic-ip', () => ({
  getAllBasicIp: vi.fn(),
  terminateBasicIp: vi.fn(),
  attachBasicIp: vi.fn(),
  detachBasicIp: vi.fn(),
}));

vi.mock('./useInstances', () => ({
  useInstances: vi.fn(),
}));

vi.mock('./useProjectGateways', () => ({
  useProjectGateways: vi.fn(),
}));

const projectId = 'project-id';

const buildBasicIp = (overrides: Partial<TBasicIp> = {}) =>
  ({
    id: '203.0.113.42',
    resourceStatus: 'READY',
    currentState: {
      associatedResource: null,
      id: 'openstack-id',
      ip: '203.0.113.42',
      location: { region: 'GRA11' },
    },
    targetSpec: { location: { region: 'GRA11' } },
    currentTasks: [],
    ...overrides,
  } as TBasicIp);

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider
    client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}
  >
    {children}
  </QueryClientProvider>
);

describe('useAllBasicIp', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('flags an ip carrying an associated resource as attached', async () => {
    vi.mocked(getAllBasicIp).mockResolvedValue([
      buildBasicIp({
        currentState: {
          associatedResource: { id: 'instance-id', type: 'instance' },
          id: 'openstack-id',
          ip: '203.0.113.42',
          location: { region: 'GRA11' },
        },
      }),
    ]);

    const { result } = renderHook(() => useAllBasicIp(projectId), { wrapper });

    await waitFor(() => expect(result.current.data).toBeDefined());
    expect(result.current.data[0]).toEqual(
      expect.objectContaining({
        isAttached: true,
        associatedResourceId: 'instance-id',
        region: 'GRA11',
      }),
    );
  });

  it('flags an ip without an associated resource as detached', async () => {
    vi.mocked(getAllBasicIp).mockResolvedValue([buildBasicIp()]);

    const { result } = renderHook(() => useAllBasicIp(projectId), { wrapper });

    await waitFor(() => expect(result.current.data).toBeDefined());
    expect(result.current.data[0]).toEqual(
      expect.objectContaining({ isAttached: false, associatedResourceId: '' }),
    );
  });

  it('falls back to the target region when the current state has none', async () => {
    vi.mocked(getAllBasicIp).mockResolvedValue([
      buildBasicIp({
        currentState: {
          associatedResource: null,
          id: null,
          ip: '203.0.113.42',
          location: undefined,
        },
        targetSpec: { location: { region: 'BHS5' } },
      } as never),
    ]);

    const { result } = renderHook(() => useAllBasicIp(projectId), { wrapper });

    await waitFor(() => expect(result.current.data).toBeDefined());
    expect(result.current.data[0].region).toBe('BHS5');
  });

  it('does not query while disabled', () => {
    renderHook(() => useAllBasicIp(projectId, false), { wrapper });

    expect(getAllBasicIp).not.toHaveBeenCalled();
  });

  describe('ip version', () => {
    const withCurrentState = (
      currentState: Partial<TBasicIp['currentState']>,
    ) =>
      buildBasicIp({
        currentState: {
          associatedResource: null,
          id: 'openstack-id',
          ip: '203.0.113.42',
          location: { region: 'GRA11' },
          ...currentState,
        } as TBasicIp['currentState'],
      });

    it.each([
      [4, 4],
      [6, 6],
      ['4', 4],
      ['6', 6],
      ['IPV4', 4],
      ['IPV6', 6],
      ['v6', 6],
    ])('reads the version the api reports (%s)', async (reported, expected) => {
      vi.mocked(getAllBasicIp).mockResolvedValue([
        withCurrentState({ ipVersion: reported }),
      ]);

      const { result } = renderHook(() => useAllBasicIp(projectId), {
        wrapper,
      });

      await waitFor(() => expect(result.current.data).toBeDefined());
      expect(result.current.data[0].ipVersion).toBe(expected);
    });

    it('derives the version from the address when the api reports none', async () => {
      vi.mocked(getAllBasicIp).mockResolvedValue([
        buildBasicIp({
          id: 'v6-only',
          currentState: {
            associatedResource: null,
            id: 'extnet-v6-only',
            ip: '2001:41d0:801:1000::1d',
            location: { region: 'GRA11' },
          },
        }),
        buildBasicIp({
          id: 'v4-only',
          currentState: {
            associatedResource: null,
            id: 'extnet-v4-only',
            ip: '203.0.113.42',
            location: { region: 'GRA11' },
          },
        }),
      ]);

      const { result } = renderHook(() => useAllBasicIp(projectId), {
        wrapper,
      });

      await waitFor(() => expect(result.current.data).toBeDefined());
      expect(result.current.data.map(({ ipVersion }) => ipVersion)).toEqual([
        6,
        4,
      ]);
    });

    it('makes the version searchable', async () => {
      vi.mocked(getAllBasicIp).mockResolvedValue([
        withCurrentState({ ipVersion: 6 }),
      ]);

      const { result } = renderHook(() => useAllBasicIp(projectId), {
        wrapper,
      });

      await waitFor(() => expect(result.current.data).toBeDefined());
      expect(result.current.data[0].search).toContain('ipv6');
    });
  });
});

describe('useBasicIps', () => {
  const pagination = { pageIndex: 0, pageSize: 10 };

  const attachedTo = (resourceId: string, type = 'instance') =>
    buildBasicIp({
      currentState: {
        associatedResource: { id: resourceId, type },
        id: 'openstack-id',
        ip: '203.0.113.42',
        location: { region: 'GRA11' },
      },
    });

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

  const renderListing = () =>
    renderHook(() => useBasicIps(projectId, { pagination }), { wrapper });

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useInstances).mockReturnValue({
      data: [{ id: 'instance-id', name: 'my-instance' }],
      isLoading: false,
    } as never);
    vi.mocked(useProjectGateways).mockReturnValue({
      data: [buildGateway()],
      isLoading: false,
    } as never);
  });

  it('resolves the associated resource name from the project instances', async () => {
    vi.mocked(getAllBasicIp).mockResolvedValue([attachedTo('instance-id')]);

    const { result } = renderListing();

    await waitFor(() => expect(result.current.data.rows).toHaveLength(1));
    expect(result.current.data.rows[0]).toEqual(
      expect.objectContaining({
        associatedResourceId: 'instance-id',
        associatedResourceName: 'my-instance',
      }),
    );
  });

  it('leaves the name empty when the associated instance is unknown', async () => {
    vi.mocked(getAllBasicIp).mockResolvedValue([attachedTo('vanished-id')]);

    const { result } = renderListing();

    await waitFor(() => expect(result.current.data.rows).toHaveLength(1));
    expect(result.current.data.rows[0].associatedResourceName).toBe('');
  });

  it('resolves the associated resource name from the project gateways', async () => {
    vi.mocked(getAllBasicIp).mockResolvedValue([
      attachedTo('gateway-id', 'gateway'),
    ]);

    const { result } = renderListing();

    await waitFor(() => expect(result.current.data.rows).toHaveLength(1));
    expect(result.current.data.rows[0]).toEqual(
      expect.objectContaining({
        associatedResourceType: 'gateway',
        associatedResourceName: 'my-gateway',
      }),
    );
  });

  it('names a gateway from its target spec while it has no current state', async () => {
    vi.mocked(getAllBasicIp).mockResolvedValue([
      attachedTo('gateway-id', 'gateway'),
    ]);
    vi.mocked(useProjectGateways).mockReturnValue({
      data: [buildGateway({ currentState: null })],
      isLoading: false,
    } as never);

    const { result } = renderListing();

    await waitFor(() => expect(result.current.data.rows).toHaveLength(1));
    expect(result.current.data.rows[0].associatedResourceName).toBe(
      'my-gateway-target',
    );
  });

  it.each(['GATEWAY', 'Gateway', 'gateway'])(
    'resolves the name whichever case the api spells the type in (%s)',
    async (type) => {
      vi.mocked(getAllBasicIp).mockResolvedValue([
        attachedTo('gateway-id', type),
      ]);

      const { result } = renderListing();

      await waitFor(() => expect(result.current.data.rows).toHaveLength(1));
      expect(result.current.data.rows[0].associatedResourceName).toBe(
        'my-gateway',
      );
    },
  );

  it('does not resolve a name for a resource kind it does not know', async () => {
    vi.mocked(getAllBasicIp).mockResolvedValue([
      attachedTo('gateway-id', 'loadbalancer'),
    ]);

    const { result } = renderListing();

    await waitFor(() => expect(result.current.data.rows).toHaveLength(1));
    expect(result.current.data.rows[0]).toEqual(
      expect.objectContaining({
        associatedResourceType: 'loadbalancer',
        associatedResourceName: '',
      }),
    );
  });

  it('makes the associated resource name searchable', async () => {
    vi.mocked(getAllBasicIp).mockResolvedValue([attachedTo('instance-id')]);

    const { result } = renderListing();

    await waitFor(() => expect(result.current.data.rows).toHaveLength(1));
    expect(result.current.data.rows[0].search).toContain('my-instance');
  });

  it('waits for the instances before rendering, to avoid showing ids then names', async () => {
    vi.mocked(getAllBasicIp).mockResolvedValue([attachedTo('instance-id')]);
    vi.mocked(useInstances).mockReturnValue({
      data: undefined,
      isLoading: true,
    } as never);

    const { result } = renderListing();

    await waitFor(() => expect(result.current.isLoading).toBe(true));
  });

  it('waits for the gateways before rendering, to avoid showing ids then names', async () => {
    vi.mocked(getAllBasicIp).mockResolvedValue([
      attachedTo('gateway-id', 'gateway'),
    ]);
    vi.mocked(useProjectGateways).mockReturnValue({
      data: undefined,
      isLoading: true,
    } as never);

    const { result } = renderListing();

    await waitFor(() => expect(result.current.isLoading).toBe(true));
  });

  it('still lists the ips when the instances cannot be fetched', async () => {
    vi.mocked(getAllBasicIp).mockResolvedValue([attachedTo('instance-id')]);
    vi.mocked(useInstances).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('nope'),
    } as never);

    const { result } = renderListing();

    await waitFor(() => expect(result.current.data.rows).toHaveLength(1));
    expect(result.current.error).toBeNull();
  });

  it('still lists the ips when the gateways cannot be fetched', async () => {
    vi.mocked(getAllBasicIp).mockResolvedValue([
      attachedTo('gateway-id', 'gateway'),
    ]);
    vi.mocked(useProjectGateways).mockReturnValue({
      data: undefined,
      isLoading: false,
      error: new Error('nope'),
    } as never);

    const { result } = renderListing();

    await waitFor(() => expect(result.current.data.rows).toHaveLength(1));
    expect(result.current.error).toBeNull();
    expect(result.current.data.rows[0].associatedResourceId).toBe('gateway-id');
  });
});

describe('useTerminateBasicIps', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('reports the ips that could not be deleted without dropping the others', async () => {
    vi.mocked(terminateBasicIp).mockImplementation((_projectId, id) =>
      id === 'failing-ip'
        ? Promise.reject(new Error('nope'))
        : Promise.resolve({} as never),
    );

    const onSettled = vi.fn();
    const { result } = renderHook(
      () => useTerminateBasicIps({ projectId, onSettled }),
      { wrapper },
    );

    result.current.terminate(['first-ip', 'failing-ip', 'last-ip']);

    await waitFor(() => expect(onSettled).toHaveBeenCalled());
    expect(onSettled).toHaveBeenCalledWith({
      deleted: ['first-ip', 'last-ip'],
      failed: ['failing-ip'],
    });
    expect(terminateBasicIp).toHaveBeenCalledTimes(3);
  });

  it('reports every ip as deleted when all calls succeed', async () => {
    vi.mocked(terminateBasicIp).mockResolvedValue({} as never);

    const onSettled = vi.fn();
    const { result } = renderHook(
      () => useTerminateBasicIps({ projectId, onSettled }),
      { wrapper },
    );

    result.current.terminate(['first-ip', 'last-ip']);

    await waitFor(() => expect(onSettled).toHaveBeenCalled());
    expect(onSettled).toHaveBeenCalledWith({
      deleted: ['first-ip', 'last-ip'],
      failed: [],
    });
  });
});
