import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { describe, it, vi } from 'vitest';
import { useInstance, useInstances } from '@/api/hooks/useInstance';

vi.mock('@/api/data/instance', () => ({
  getInstance: vi.fn(),
  getInstances: vi.fn(),
}));

const queryClient = new QueryClient();

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('useInstance', () => {
  it('returns instance data when instanceId is provided', async () => {
    const instance = { id: '1', name: 'Instance 1' };
    const getInstance = vi.fn().mockResolvedValue(instance);

    const { result } = renderHook(() => useInstance('123', '1'), {
      wrapper,
    });

    waitFor(() => {
      expect(getInstance).toHaveBeenCalledWith('123', '1');
      expect(result.current.data).toEqual(instance);
    });
  });

  it('does not fetch data when instanceId is not provided', () => {
    const getInstance = vi.fn();
    const { result } = renderHook(() => useInstance('123', null), { wrapper });

    expect(getInstance).not.toHaveBeenCalled();
    expect(result.current.isPending).toBe(true);
  });
});

describe('useInstances', () => {
  it('returns instances data when region is provided', async () => {
    const instances = [
      { id: '1', name: 'Instance 1' },
      { id: '2', name: 'Instance 2' },
    ];
    const getInstances = vi.fn().mockResolvedValue(instances);

    const { result } = renderHook(() => useInstances('123', 'region1'), {
      wrapper,
    });

    waitFor(() => {
      expect(getInstances).toHaveBeenCalledWith('123', 'region1');
      expect(result.current.data).toEqual(instances);
    });
  });

  it('does not fetch data when region is not provided', () => {
    const getInstances = vi.fn();
    const { result } = renderHook(() => useInstances('123', null), { wrapper });

    expect(getInstances).not.toHaveBeenCalled();
    expect(result.current.isPending).toBe(true);
  });
});
