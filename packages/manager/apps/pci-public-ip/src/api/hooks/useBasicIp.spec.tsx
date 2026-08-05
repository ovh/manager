import { beforeEach, describe, expect, it, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { getAllBasicIp, terminateBasicIp, TBasicIp } from '@/api/data/basic-ip';
import { useAllBasicIp, useTerminateBasicIps } from './useBasicIp';

vi.mock('@/api/data/basic-ip', () => ({
  getAllBasicIp: vi.fn(),
  terminateBasicIp: vi.fn(),
  attachBasicIp: vi.fn(),
  detachBasicIp: vi.fn(),
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
