import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { POLLING_INTERVAL_MS, POLLING_TIMEOUT_MS } from '@/module.constants';
import { BackupServerResource } from '@/types/BackupServer.type';
import { CurrentTask } from '@/types/Resource.type';

import { useBackupServersPolling } from './useBackupServersPolling';

const task: CurrentTask = {
  id: 'task-1',
  link: '/me/task/task-1',
  status: 'RUNNING',
  type: 'BACKUP_LICENSES_SERVER_LICENSE_CHANGE',
};

const buildServer = (currentTasks: CurrentTask[]): BackupServerResource => ({
  id: 'server-1',
  status: 'ENABLED',
  currentState: { id: 'server-1', displayName: 'VBR-01' },
  currentTasks,
});

const idleServers = [buildServer([])];
const inFlightServers = [buildServer([task])];

describe('useBackupServersPolling', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('polls while at least one server has a current task', () => {
    const { result } = renderHook(() => useBackupServersPolling(inFlightServers));

    expect(result.current.refetchInterval).toBe(POLLING_INTERVAL_MS);
    expect(result.current.hasTimedOut).toBe(false);
  });

  it.each([undefined, idleServers])('does not poll when no server is in flight (%#)', (servers) => {
    const { result } = renderHook(() => useBackupServersPolling(servers));

    expect(result.current.refetchInterval).toBe(false);
  });

  // Régression : une tâche en échec reste dans `currentTasks`. Sans ce filtre on pollait
  // 5 min pour rien, puis on affichait « l'opération prend plus de temps que prévu » alors
  // qu'elle avait échoué — et le message ne partait jamais.
  it('neither polls nor times out when the only task has failed', () => {
    const { result } = renderHook(() =>
      useBackupServersPolling([buildServer([{ ...task, status: 'ERROR' }])]),
    );

    act(() => {
      vi.advanceTimersByTime(POLLING_TIMEOUT_MS);
    });

    expect(result.current.refetchInterval).toBe(false);
    expect(result.current.hasTimedOut).toBe(false);
  });

  it('stops polling as soon as the last task is done', () => {
    const { result, rerender } = renderHook(
      ({ servers }: { servers: BackupServerResource[] }) => useBackupServersPolling(servers),
      { initialProps: { servers: inFlightServers } },
    );

    expect(result.current.refetchInterval).toBe(POLLING_INTERVAL_MS);

    rerender({ servers: idleServers });

    expect(result.current.refetchInterval).toBe(false);
  });

  it('stops polling and reports a timeout beyond POLLING_TIMEOUT_MS', () => {
    const { result } = renderHook(() => useBackupServersPolling(inFlightServers));

    act(() => {
      vi.advanceTimersByTime(POLLING_TIMEOUT_MS);
    });

    expect(result.current.hasTimedOut).toBe(true);
    expect(result.current.refetchInterval).toBe(false);
  });

  it('does not report a timeout before POLLING_TIMEOUT_MS', () => {
    const { result } = renderHook(() => useBackupServersPolling(inFlightServers));

    act(() => {
      vi.advanceTimersByTime(POLLING_TIMEOUT_MS - 1);
    });

    expect(result.current.hasTimedOut).toBe(false);
    expect(result.current.refetchInterval).toBe(POLLING_INTERVAL_MS);
  });

  it('rearms the sequence after a manual refresh', () => {
    const { result } = renderHook(() => useBackupServersPolling(inFlightServers));

    act(() => {
      vi.advanceTimersByTime(POLLING_TIMEOUT_MS);
    });
    expect(result.current.hasTimedOut).toBe(true);

    act(() => {
      result.current.resetPolling();
    });

    expect(result.current.hasTimedOut).toBe(false);
    expect(result.current.refetchInterval).toBe(POLLING_INTERVAL_MS);
  });

  it('clears the timeout once the operations are over', () => {
    const { result, rerender } = renderHook(
      ({ servers }: { servers: BackupServerResource[] }) => useBackupServersPolling(servers),
      { initialProps: { servers: inFlightServers } },
    );

    rerender({ servers: idleServers });
    act(() => {
      vi.advanceTimersByTime(POLLING_TIMEOUT_MS);
    });

    expect(result.current.hasTimedOut).toBe(false);
  });
});
