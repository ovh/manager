import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { FC, PropsWithChildren } from 'react';
import { useInstanceCreationPolling } from '../useInstanceCreationPolling';
import { getOperations, getOperation } from '@/data/api/operation';
import { TOperation } from '@/domain/entities/operations';
import queryClient from '@/queryClient';

vi.mock('@/data/api/operation', () => ({
  getOperations: vi.fn(),
  getOperation: vi.fn(),
}));

const wrapper: FC<PropsWithChildren> = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useInstanceCreationPolling', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    queryClient.clear();
  });

  describe('when no operations exist', () => {
    it('should return instancesCreationsCount as 0 and hasError as false', async () => {
      vi.mocked(getOperations).mockResolvedValue([]);

      const { result } = renderHook(() => useInstanceCreationPolling(), {
        wrapper,
      });

      await waitFor(() => {
        expect(result.current.instancesCreationsCount).toBe(0);
        expect(result.current.hasError).toBe(false);
      });
    });
  });

  describe('when pending instance creation operations exist', () => {
    it('should return correct count for single pending operation', async () => {
      const pendingOperation: TOperation = {
        id: 'op-1',
        action: 'instance#create',
        status: 'pending',
        subOperations: [],
      };

      vi.mocked(getOperations).mockResolvedValue([pendingOperation]);
      vi.mocked(getOperation).mockResolvedValue(pendingOperation);

      const { result } = renderHook(() => useInstanceCreationPolling(), {
        wrapper,
      });

      await waitFor(() => {
        expect(result.current.instancesCreationsCount).toBe(1);
        expect(result.current.hasError).toBe(false);
      });
    });

    it('should return correct count for multiple pending operations', async () => {
      const pendingOp1: TOperation = {
        id: 'op-1',
        action: 'instance#create',
        status: 'pending',
        subOperations: [],
      };
      const pendingOp2: TOperation = {
        id: 'op-2',
        action: 'instance#create',
        status: 'created',
        subOperations: [],
      };

      vi.mocked(getOperations).mockResolvedValue([pendingOp1, pendingOp2]);
      vi.mocked(getOperation).mockImplementation((_, id) => {
        if (id === 'op-1') return Promise.resolve(pendingOp1);
        if (id === 'op-2') return Promise.resolve(pendingOp2);
        return Promise.reject(new Error('Not found'));
      });

      const { result } = renderHook(() => useInstanceCreationPolling(), {
        wrapper,
      });

      await waitFor(() => {
        expect(result.current.instancesCreationsCount).toBe(2);
        expect(result.current.hasError).toBe(false);
      });
    });

    it('should count pending sub-operations correctly', async () => {
      const operationWithSubOps: TOperation = {
        id: 'op-1',
        action: 'instance#create',
        status: 'pending',
        subOperations: [
          {
            id: 'sub-1',
            action: 'instance#create',
            status: 'pending',
          },
          {
            id: 'sub-2',
            action: 'instance#create',
            status: 'pending',
          },
          {
            id: 'sub-3',
            action: 'instance#create',
            status: 'completed',
          },
        ],
      };

      vi.mocked(getOperations).mockResolvedValue([operationWithSubOps]);
      vi.mocked(getOperation).mockResolvedValue(operationWithSubOps);

      const { result } = renderHook(() => useInstanceCreationPolling(), {
        wrapper,
      });

      await waitFor(() => {
        expect(result.current.instancesCreationsCount).toBe(2);
        expect(result.current.hasError).toBe(false);
      });
    });
  });

  describe('when operations are in error', () => {
    it('should set hasError to true for operation with error status', async () => {
      const errorOperation: TOperation = {
        id: 'op-1',
        action: 'instance#create',
        status: 'error',
        subOperations: [],
      };

      vi.mocked(getOperations).mockResolvedValue([errorOperation]);
      vi.mocked(getOperation).mockResolvedValue(errorOperation);

      const { result } = renderHook(() => useInstanceCreationPolling(), {
        wrapper,
      });

      await waitFor(() => {
        expect(result.current.hasError).toBe(true);
        expect(result.current.instancesCreationsCount).toBe(0);
      });
    });

    it('should set hasError to true when sub-operation has error', async () => {
      const operationWithErrorSubOp: TOperation = {
        id: 'op-1',
        action: 'instance#create',
        status: 'pending',
        subOperations: [
          {
            id: 'sub-1',
            action: 'instance#create',
            status: 'error',
          },
          {
            id: 'sub-2',
            action: 'instance#create',
            status: 'pending',
          },
        ],
      };

      vi.mocked(getOperations).mockResolvedValue([operationWithErrorSubOp]);
      vi.mocked(getOperation).mockResolvedValue(operationWithErrorSubOp);

      const { result } = renderHook(() => useInstanceCreationPolling(), {
        wrapper,
      });

      await waitFor(() => {
        expect(result.current.hasError).toBe(true);
        expect(result.current.instancesCreationsCount).toBe(1);
      });
    });
  });

  describe('when non-instance-creation operations exist', () => {
    it('should not count non-instance-creation operations', async () => {
      const deleteOperation: TOperation = {
        id: 'op-1',
        action: 'instance#delete',
        status: 'pending',
        subOperations: [],
      };

      vi.mocked(getOperations).mockResolvedValue([deleteOperation]);

      const { result } = renderHook(() => useInstanceCreationPolling(), {
        wrapper,
      });

      await waitFor(() => {
        expect(result.current.instancesCreationsCount).toBe(0);
        expect(result.current.hasError).toBe(false);
      });
    });
  });

  describe('when operations have mixed statuses', () => {
    it('should count only pending instance creation operations', async () => {
      const pendingOp: TOperation = {
        id: 'op-1',
        action: 'instance#create',
        status: 'pending',
        subOperations: [],
      };

      const errorOp: TOperation = {
        id: 'op-3',
        action: 'instance#create',
        status: 'error',
        subOperations: [],
      };

      vi.mocked(getOperations).mockResolvedValue([pendingOp, errorOp]);
      vi.mocked(getOperation).mockImplementation((_, id) => {
        if (id === 'op-1') return Promise.resolve(pendingOp);
        if (id === 'op-3') return Promise.resolve(errorOp);
        return Promise.reject(new Error('Not found'));
      });

      const { result } = renderHook(() => useInstanceCreationPolling(), {
        wrapper,
      });

      await waitFor(() => {
        expect(result.current.instancesCreationsCount).toBe(1);
        expect(result.current.hasError).toBe(true);
      });
    });
  });
});
