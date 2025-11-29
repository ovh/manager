/* eslint-disable @typescript-eslint/no-explicit-any, max-lines-per-function, react/display-name */
import { ReactNode } from 'react';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import * as coreApi from '@ovh-ux/manager-core-api';

import { useUpdateSnapshotTypes } from './useUpdateSnapshotTypes';

// Mock modules
vi.mock('@ovh-ux/manager-core-api');
vi.mock('@ovh-ux/muk', () => ({
  useNotifications: () => ({
    addSuccess: vi.fn(),
    addError: vi.fn(),
  }),
}));
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

describe('useUpdateSnapshotTypes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const createWrapper = () => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });
    return ({ children }: { children: ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };

  it('should enable and disable snapshot types', async () => {
    const mockPost = vi.fn().mockResolvedValue({ data: { taskId: 'task-1' } });
    const mockDelete = vi.fn().mockResolvedValue({ data: { taskId: 'task-2' } });

    vi.mocked(coreApi.v6).post = mockPost as any;
    vi.mocked(coreApi.v6).delete = mockDelete as any;

    const { result } = renderHook(() => useUpdateSnapshotTypes(), {
      wrapper: createWrapper(),
    });

    const currentTypes = [
      { value: 'day-1', label: 'Day 1', enabled: true },
      { value: 'day-7', label: 'Day 7', enabled: false },
    ];

    const newTypes = [
      { value: 'day-1', label: 'Day 1', enabled: false },
      { value: 'day-7', label: 'Day 7', enabled: true },
    ];

    await result.current.mutateAsync({
      serviceName: 'test-service',
      partitionName: 'test-partition',
      currentTypes,
      newTypes,
    });

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledWith(expect.stringContaining('/snapshot'), {
        snapshotType: 'day-7',
      });
      expect(mockDelete).toHaveBeenCalledWith(expect.stringContaining('/snapshot/day-1'));
    });
  });

  it('should handle only enabling types', async () => {
    const mockPost = vi.fn().mockResolvedValue({ data: { taskId: 'task-1' } });
    const mockDelete = vi.fn();

    vi.mocked(coreApi.v6).post = mockPost as any;
    vi.mocked(coreApi.v6).delete = mockDelete as any;

    const { result } = renderHook(() => useUpdateSnapshotTypes(), {
      wrapper: createWrapper(),
    });

    const currentTypes = [
      { value: 'day-1', label: 'Day 1', enabled: false },
      { value: 'day-7', label: 'Day 7', enabled: false },
    ];

    const newTypes = [
      { value: 'day-1', label: 'Day 1', enabled: true },
      { value: 'day-7', label: 'Day 7', enabled: false },
    ];

    await result.current.mutateAsync({
      serviceName: 'test-service',
      partitionName: 'test-partition',
      currentTypes,
      newTypes,
    });

    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledTimes(1);
      expect(mockDelete).not.toHaveBeenCalled();
    });
  });

  it('should handle only disabling types', async () => {
    const mockPost = vi.fn();
    const mockDelete = vi.fn().mockResolvedValue({ data: { taskId: 'task-1' } });

    vi.mocked(coreApi.v6).post = mockPost as any;
    vi.mocked(coreApi.v6).delete = mockDelete as any;

    const { result } = renderHook(() => useUpdateSnapshotTypes(), {
      wrapper: createWrapper(),
    });

    const currentTypes = [
      { value: 'day-1', label: 'Day 1', enabled: true },
      { value: 'day-7', label: 'Day 7', enabled: false },
    ];

    const newTypes = [
      { value: 'day-1', label: 'Day 1', enabled: false },
      { value: 'day-7', label: 'Day 7', enabled: false },
    ];

    await result.current.mutateAsync({
      serviceName: 'test-service',
      partitionName: 'test-partition',
      currentTypes,
      newTypes,
    });

    await waitFor(() => {
      expect(mockPost).not.toHaveBeenCalled();
      expect(mockDelete).toHaveBeenCalledTimes(1);
    });
  });

  it('should return multiple task IDs when multiple changes', async () => {
    const mockPost = vi
      .fn()
      .mockResolvedValueOnce({ data: { taskId: 'task-1' } })
      .mockResolvedValueOnce({ data: { taskId: 'task-2' } });
    const mockDelete = vi.fn().mockResolvedValue({ data: { taskId: 'task-3' } });

    vi.mocked(coreApi.v6).post = mockPost as any;
    vi.mocked(coreApi.v6).delete = mockDelete as any;

    const { result } = renderHook(() => useUpdateSnapshotTypes(), {
      wrapper: createWrapper(),
    });

    const currentTypes = [
      { value: 'day-1', label: 'Day 1', enabled: true },
      { value: 'day-7', label: 'Day 7', enabled: false },
      { value: 'hour-1', label: 'Hour 1', enabled: false },
    ];

    const newTypes = [
      { value: 'day-1', label: 'Day 1', enabled: false },
      { value: 'day-7', label: 'Day 7', enabled: true },
      { value: 'hour-1', label: 'Hour 1', enabled: true },
    ];

    const response = await result.current.mutateAsync({
      serviceName: 'test-service',
      partitionName: 'test-partition',
      currentTypes,
      newTypes,
    });

    await waitFor(() => {
      expect(response.taskIds).toHaveLength(3);
      expect(mockPost).toHaveBeenCalledTimes(2);
      expect(mockDelete).toHaveBeenCalledTimes(1);
    });
  });

  it('should not make any API calls if types unchanged', async () => {
    const mockPost = vi.fn();
    const mockDelete = vi.fn();

    vi.mocked(coreApi.v6).post = mockPost as any;
    vi.mocked(coreApi.v6).delete = mockDelete as any;

    const { result } = renderHook(() => useUpdateSnapshotTypes(), {
      wrapper: createWrapper(),
    });

    const types = [
      { value: 'day-1', label: 'Day 1', enabled: true },
      { value: 'day-7', label: 'Day 7', enabled: false },
    ];

    const response = await result.current.mutateAsync({
      serviceName: 'test-service',
      partitionName: 'test-partition',
      currentTypes: types,
      newTypes: types,
    });

    expect(response.taskIds).toHaveLength(0);
    expect(mockPost).not.toHaveBeenCalled();
    expect(mockDelete).not.toHaveBeenCalled();
  });
});
