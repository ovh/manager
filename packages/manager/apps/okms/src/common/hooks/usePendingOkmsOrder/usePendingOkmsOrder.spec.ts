import { useOkmsList } from '@key-management-service/data/hooks/useOkms';
import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useNotifications } from '@ovh-ux/muk';

import { REGION_EU_WEST_RBX } from '@/common/mocks/catalog/catalog.mock';
import { clearPendingOrder, registerPendingOrder } from '@/common/store/pendingOkmsOrder';

import { pollOnNewOkms } from './pollOnNewOkms';
import {
  OKMS_LIST_REFETCH_INTERVAL_IN_MS,
  ORDER_EXPIRATION_IN_MINUTES,
  usePendingOkmsOrder,
} from './usePendingOkmsOrder';

vi.mock('@key-management-service/data/hooks/useOkms', () => ({
  useOkmsList: vi.fn(),
}));

vi.mock('react-i18next', () => ({
  useTranslation: vi.fn(() => ({ t: vi.fn((key: string) => key) })),
}));

vi.mock('@ovh-ux/muk', async () => {
  const original = await vi.importActual('@ovh-ux/muk');
  return {
    ...original,
    useNotifications: vi.fn(),
  };
});

vi.mock('./pollOnNewOkms', () => ({
  pollOnNewOkms: vi.fn(),
}));

const mockUseOkmsList = vi.mocked(useOkmsList);
const mockUseNotifications = vi.mocked(useNotifications);
const mockPollOnNewOkms = vi.mocked(pollOnNewOkms);

describe('usePendingOkmsOrder', () => {
  const mockRefetch = vi.fn();
  const mockAddSuccess = vi.fn();
  const mockAddWarning = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    mockUseNotifications.mockReturnValue({
      addSuccess: mockAddSuccess,
      addWarning: mockAddWarning,
    });

    mockUseOkmsList.mockReturnValue({
      refetch: mockRefetch,
    } as unknown as ReturnType<typeof useOkmsList>);
  });

  it('returns the hasPendingOrder flag from the store', () => {
    registerPendingOrder(REGION_EU_WEST_RBX);

    const { result } = renderHook(() => usePendingOkmsOrder());

    expect(result.current.hasPendingOrder).toBe(true);
  });

  it('enables polling when there is a pending order', async () => {
    vi.useFakeTimers();
    registerPendingOrder(REGION_EU_WEST_RBX);

    renderHook(() => usePendingOkmsOrder());

    // fast forward time to 4 secondes
    await vi.advanceTimersByTimeAsync(OKMS_LIST_REFETCH_INTERVAL_IN_MS * 2);

    expect(mockPollOnNewOkms).toHaveBeenCalledTimes(2);

    expect(mockPollOnNewOkms).toHaveBeenCalledWith({
      refetch: mockRefetch,
      onSuccess: expect.any(Function) as (okmsId: string) => void,
      onExpired: expect.any(Function) as () => void,
      expirationInMinutes: ORDER_EXPIRATION_IN_MINUTES,
    });

    vi.useRealTimers();
  });

  it('disables polling when there is no pending order', async () => {
    vi.useFakeTimers();
    clearPendingOrder();

    renderHook(() => usePendingOkmsOrder());

    // fast forward time to 4 secondes
    await vi.advanceTimersByTimeAsync(4000);

    expect(mockPollOnNewOkms).not.toHaveBeenCalled();

    vi.useRealTimers();
  });

  it('calls the onSuccess callback when a new OKMS is found', async () => {
    const mockOnSuccess = vi.fn();
    mockPollOnNewOkms.mockImplementation(({ onSuccess }) => {
      onSuccess('new-okms-id');
      return Promise.resolve();
    });

    vi.useFakeTimers();
    registerPendingOrder(REGION_EU_WEST_RBX);

    renderHook(() => usePendingOkmsOrder({ onSuccess: mockOnSuccess }));

    await vi.advanceTimersByTimeAsync(OKMS_LIST_REFETCH_INTERVAL_IN_MS * 2);

    expect(mockOnSuccess).toHaveBeenCalledWith('new-okms-id');
  });
});
