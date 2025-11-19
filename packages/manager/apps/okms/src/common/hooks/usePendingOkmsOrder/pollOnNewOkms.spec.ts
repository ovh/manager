/* eslint-disable @typescript-eslint/unbound-method */
import { okmsQueryKeys } from '@key-management-service/data/api/okms';
import { OKMS } from '@key-management-service/types/okms.type';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import * as pendingOkmsOrderStore from '@/common/store/pendingOkmsOrder';
import {
  clearPendingOrder,
  registerPendingOrder,
  saveInitialOkmsIds,
  usePendingOkmsOrderStore,
} from '@/common/store/pendingOkmsOrder';
import { queryClient } from '@/common/utils/react-query/queryClient';

import { pollOnNewOkms } from './pollOnNewOkms';

vi.mock('@/common/utils/react-query/queryClient', () => ({
  queryClient: {
    invalidateQueries: vi.fn(),
  },
}));

const mockOkms1: OKMS = {
  id: 'okms-1',
} as OKMS;

const mockOkms2: OKMS = {
  id: 'okms-2',
} as OKMS;

const mockOkms3: OKMS = {
  id: 'okms-3',
} as OKMS;

describe('pollOnNewOkms', () => {
  const mockRefetch = vi.fn();
  const mockOnSuccess = vi.fn();
  const mockOnExpired = vi.fn();
  const expirationInMinutes = 1;

  beforeEach(() => {
    vi.clearAllMocks();
    // Reset store to initial state
    clearPendingOrder();
    // Spy on store actions
    vi.spyOn(pendingOkmsOrderStore, 'clearPendingOrder');
    vi.spyOn(pendingOkmsOrderStore, 'saveInitialOkmsIds');
    // Spy on queryClient method
    vi.spyOn(queryClient, 'invalidateQueries');
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  describe('when there is no pending order', () => {
    it('should return early without doing anything', async () => {
      // GIVEN - No pending order
      clearPendingOrder();

      // WHEN
      await pollOnNewOkms({
        refetch: mockRefetch,
        onSuccess: mockOnSuccess,
        onExpired: mockOnExpired,
        expirationInMinutes,
      });

      // THEN
      expect(mockRefetch).not.toHaveBeenCalled();
      expect(mockOnSuccess).not.toHaveBeenCalled();
      expect(mockOnExpired).not.toHaveBeenCalled();
      expect(queryClient.invalidateQueries).not.toHaveBeenCalled();
    });
  });

  describe('when the order has expired', () => {
    it('should call onExpired and clear the pending order', async () => {
      // GIVEN - Expired order
      // Set up expired order by manually setting createdAt in the past
      usePendingOkmsOrderStore.setState({
        hasPendingOrder: true,
        createdAt: '2025-11-12T10:00:00.000Z',
        region: 'eu-west-sbg',
      });
      saveInitialOkmsIds(['okms-1']);

      const now = new Date('2025-11-12T10:02:00.000Z').getTime(); // 2 minutes later
      vi.setSystemTime(now);

      mockRefetch.mockResolvedValue({
        data: [mockOkms1],
      });

      // WHEN
      await pollOnNewOkms({
        refetch: mockRefetch,
        onSuccess: mockOnSuccess,
        onExpired: mockOnExpired,
        expirationInMinutes,
      });

      // THEN
      expect(mockOnExpired).toHaveBeenCalledWith();
      expect(clearPendingOrder).toHaveBeenCalled();
      expect(mockOnSuccess).not.toHaveBeenCalled();
      expect(queryClient.invalidateQueries).not.toHaveBeenCalled();
    });
  });

  describe('initialOkmsIds', () => {
    it('should save initial OKMS ids and return early when it is null', async () => {
      // GIVEN - Pending order exists but no initial IDs
      const now = new Date('2025-11-12T10:00:30.000Z').getTime(); // 30 seconds later
      vi.setSystemTime(now);

      registerPendingOrder('eu-west-sbg');

      const okmsList = [mockOkms1, mockOkms2];
      mockRefetch.mockResolvedValue({
        data: okmsList,
      });

      // WHEN
      await pollOnNewOkms({
        refetch: mockRefetch,
        onSuccess: mockOnSuccess,
        onExpired: mockOnExpired,
        expirationInMinutes,
      });

      // THEN
      expect(mockRefetch).toHaveBeenCalled();
      expect(saveInitialOkmsIds).toHaveBeenCalledWith(['okms-1', 'okms-2']);
      expect(mockOnSuccess).not.toHaveBeenCalled();
      expect(mockOnExpired).not.toHaveBeenCalled();
      expect(queryClient.invalidateQueries).not.toHaveBeenCalled();
    });

    it('should handle empty OKMS list when saving initial IDs', async () => {
      // GIVEN - Pending order exists but OKMS list is empty
      const now = new Date('2025-11-12T10:00:30.000Z').getTime();
      vi.setSystemTime(now);

      registerPendingOrder('eu-west-sbg');

      mockRefetch.mockResolvedValue({
        data: [],
      });

      // WHEN
      await pollOnNewOkms({
        refetch: mockRefetch,
        onSuccess: mockOnSuccess,
        onExpired: mockOnExpired,
        expirationInMinutes,
      });

      // THEN
      expect(mockRefetch).toHaveBeenCalled();
      expect(saveInitialOkmsIds).toHaveBeenCalledWith([]);
      expect(mockOnSuccess).not.toHaveBeenCalled();
      expect(mockOnExpired).not.toHaveBeenCalled();
    });
  });

  describe('when no new OKMS is found', () => {
    it('should return early without doing anything', async () => {
      // GIVEN - Pending order exists, initial IDs exist, but no new OKMS
      const now = new Date('2025-11-12T10:00:30.000Z').getTime(); // 30 seconds later
      vi.setSystemTime(now);

      registerPendingOrder('eu-west-sbg');
      saveInitialOkmsIds(['okms-1', 'okms-2']);

      mockRefetch.mockResolvedValue({
        data: [mockOkms1, mockOkms2],
      });

      // WHEN
      await pollOnNewOkms({
        refetch: mockRefetch,
        onSuccess: mockOnSuccess,
        onExpired: mockOnExpired,
        expirationInMinutes,
      });

      // THEN
      expect(mockRefetch).toHaveBeenCalled();
      expect(mockOnSuccess).not.toHaveBeenCalled();
      expect(mockOnExpired).not.toHaveBeenCalled();
      expect(clearPendingOrder).not.toHaveBeenCalled();
      expect(queryClient.invalidateQueries).not.toHaveBeenCalled();
    });
  });

  describe('when a new OKMS is found', () => {
    it('should clear pending order, invalidate queries, and call the onSuccess callback', async () => {
      // GIVEN - Pending order exists, initial IDs exist, and new OKMS found
      const now = new Date('2025-11-12T10:00:30.000Z').getTime(); // 30 seconds later
      vi.setSystemTime(now);

      registerPendingOrder('eu-west-sbg');
      saveInitialOkmsIds(['okms-1', 'okms-2']);

      mockRefetch.mockResolvedValue({
        data: [mockOkms1, mockOkms2, mockOkms3],
      });

      // WHEN
      await pollOnNewOkms({
        refetch: mockRefetch,
        onSuccess: mockOnSuccess,
        onExpired: mockOnExpired,
        expirationInMinutes,
      });

      // THEN
      expect(mockRefetch).toHaveBeenCalled();
      expect(clearPendingOrder).toHaveBeenCalled();
      expect(queryClient.invalidateQueries).toHaveBeenCalledWith({
        queryKey: okmsQueryKeys.listDatagrid,
      });
      expect(mockOnSuccess).toHaveBeenCalledWith('okms-3');
      expect(mockOnExpired).not.toHaveBeenCalled();
    });

    it('should handle multiple new OKMSs and return the first one found', async () => {
      // GIVEN - Multiple new OKMSs in the list
      const now = new Date('2025-11-12T10:00:30.000Z').getTime();
      vi.setSystemTime(now);

      registerPendingOrder('eu-west-sbg');
      saveInitialOkmsIds(['okms-1']);

      mockRefetch.mockResolvedValue({
        data: [mockOkms1, mockOkms2, mockOkms3],
      });

      // WHEN
      await pollOnNewOkms({
        refetch: mockRefetch,
        onSuccess: mockOnSuccess,
        onExpired: mockOnExpired,
        expirationInMinutes,
      });

      // THEN - Should find the first new OKMS (okms-2)
      expect(mockOnSuccess).toHaveBeenCalledWith('okms-2');
      expect(clearPendingOrder).toHaveBeenCalled();
      expect(queryClient.invalidateQueries).toHaveBeenCalled();
    });
  });
});
