import { describe, expect } from 'vitest';
import '@testing-library/jest-dom';
import { renderHook, waitFor } from '@testing-library/react';
import { OvhSubsidiary } from '@ovh-ux/manager-react-components';
import { orderCatalogMock } from '@/api/_mock_';
import { useOrderCatalog } from '../useOrderCatalog';
import { wrapper } from '@/utils/test.provider';

describe('useOrderCatalog', () => {
  it('should return an order catalog for a product', async () => {
    const { result } = renderHook(
      () => useOrderCatalog({ ovhSubsidiary: OvhSubsidiary.FR }),
      { wrapper },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(orderCatalogMock);
  });
});
