import { useLocation } from 'react-router-dom';

import { renderHook } from '@testing-library/react';
import { vi } from 'vitest';

import { ProductType, useProductType } from './useProductType';

vi.mock('react-router-dom', async () => {
  const router = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...router,
    useLocation: vi.fn(),
  };
});

const mockUseLocation = vi.mocked(useLocation);

type TestCase = {
  pathName: string;
  productType: ProductType | null;
  shouldThrow: boolean;
};

const testCases: TestCase[] = [
  {
    pathName: '/key-management-service/other/segment',
    productType: 'key-management-service',
    shouldThrow: false,
  },
  {
    pathName: '/secret-manager/other/segment',
    productType: 'secret-manager',
    shouldThrow: false,
  },
  {
    pathName: '/not-a-product/other/segment',
    productType: null,
    shouldThrow: true,
  },
];

describe('useProductType test suite', () => {
  it.each(testCases)(
    'should return the correct productType: $productType for pathName: $pathName',
    ({ pathName, productType, shouldThrow }) => {
      // GIVEN pathName
      mockUseLocation.mockReturnValue({
        pathname: pathName,
        hash: '',
        key: '',
        state: '',
        search: '',
      });

      if (shouldThrow) {
        // Suppress console.error for this test to avoid polluting test logs when hook throws an error
        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        // WHEN
        expect(() => renderHook(() => useProductType())).toThrow();

        // THEN
        consoleErrorSpy.mockRestore();
      } else {
        // WHEN
        const { result } = renderHook(() => useProductType());

        // THEN
        expect(result.current).toBe(productType);
      }
    },
  );
});
