import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect } from 'vitest';

import { ZimbraPlanCodes, zimbraUpgradeOrderMock } from '@/data/api';
import { useUpgradeOrder } from '@/data/hooks';
import { wrapper } from '@/utils/test.provider';

describe('useUpgradeOrder', () => {
  it('should return an order catalog for a product', async () => {
    const { result } = renderHook(
      () => useUpgradeOrder({ planCode: ZimbraPlanCodes.ZIMBRA_STARTER, serviceName: 'slotId' }),
      {
        wrapper,
      },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(zimbraUpgradeOrderMock);
  });
});
