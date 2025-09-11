import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect } from 'vitest';

import { OvhSubsidiary } from '@ovh-ux/manager-react-components';

import { orderCatalogMock } from '@/data/api/__mocks__/order';
import { wrapper } from '@/utils/Test.provider';

import { useOrderCatalog } from '../useOrderCatalog';

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
