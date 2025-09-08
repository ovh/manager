import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect } from 'vitest';

import { OvhSubsidiary } from '@ovh-ux/manager-react-components';

import { orderCatalogMock } from '@/data/api';
import { useOrderCatalog } from '@/data/hooks';
import { wrapper } from '@/utils/test.provider';

describe('useOrderCatalog', () => {
  it('should return an order catalog for a product', async () => {
    const { result } = renderHook(() => useOrderCatalog({ ovhSubsidiary: OvhSubsidiary.FR }), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(orderCatalogMock);
  });
});
