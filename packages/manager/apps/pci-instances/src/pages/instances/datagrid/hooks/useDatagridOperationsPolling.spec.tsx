import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import React, { PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getOperations } from '@/data/api/operation';
import { TOperation } from '@/types/operation/entity.type';
import { useDatagridOperationsPolling } from '@/pages/instances/datagrid/hooks/useDatagridOperationsPolling';

vi.mock('@/data/api/operation');

const mockOnComplete = vi.fn();

// TODO: extract to a new render

const queryClient = new QueryClient();
const wrapper = ({ children }: PropsWithChildren) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useDatagridOperationsPolling', () => {
  it('should toto', () => {
    vi.mocked(getOperations).mockResolvedValueOnce([] as TOperation[]);

    const { result } = renderHook(
      () => useDatagridOperationsPolling(mockOnComplete),
      { wrapper },
    );

    expect(result.current.hasOperationsRunning).toBe(false);
    expect(getOperations).toHaveBeenCalledTimes(2);
    expect(mockOnComplete).not.toHaveBeenCalled();
  });
});
