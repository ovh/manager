import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, vi } from 'vitest';

import * as ApiInstanceModule from '@/api/data/instance';
import { useInstances, useSwitchToMonthlyBilling } from '@/api/hooks/instances';
import { wrapper } from '@/wrapperRenders';

vi.mock('@ovh-ux/manager-pci-common', () => ({
  getInstances: vi.fn().mockReturnValue([{ id: 'instance1', name: 'Instance 1' }]),
}));

describe('useInstances', () => {
  it('fetches instances successfully', async () => {
    const { result } = renderHook(() => useInstances('project1'), { wrapper });
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual([{ id: 'instance1', name: 'Instance 1' }]);
  });
});

describe('useSwitchToMonthlyBilling', () => {
  it('switches to monthly billing successfully', async () => {
    const mockSuccess = vi.fn();
    const mockError = vi.fn();
    vi.spyOn(ApiInstanceModule, 'switchToMonthlyBilling').mockResolvedValueOnce({} as never);
    const { result } = renderHook(
      () =>
        useSwitchToMonthlyBilling({
          projectId: 'project1',
          instanceId: 'instance1',
          onError: mockError,
          onSuccess: mockSuccess,
        }),
      { wrapper },
    );
    result.current.switchToMonthlyBilling();
    await waitFor(() => expect(mockSuccess).toHaveBeenCalled());
    expect(mockError).not.toHaveBeenCalled();
  });

  it('handles error when switching to monthly billing', async () => {
    const mockSuccess = vi.fn();
    const mockError = vi.fn();
    vi.spyOn(ApiInstanceModule, 'switchToMonthlyBilling').mockRejectedValueOnce(
      new Error('Network Error'),
    );
    const { result } = renderHook(
      () =>
        useSwitchToMonthlyBilling({
          projectId: 'project1',
          instanceId: 'instance1',
          onError: mockError,
          onSuccess: mockSuccess,
        }),
      { wrapper },
    );
    result.current.switchToMonthlyBilling();
    await waitFor(() => expect(mockError).toHaveBeenCalledWith(new Error('Network Error')));
    expect(mockSuccess).not.toHaveBeenCalled();
  });
});
