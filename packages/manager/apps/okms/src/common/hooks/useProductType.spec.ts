import { renderHook } from '@testing-library/react';
import { vi } from 'vitest';
import { useLocation } from 'react-router-dom';
import useProductType, { ProductType } from './useProductType';

vi.mock('react-router-dom', async () => {
  const router = await vi.importActual<typeof import('react-router-dom')>(
    'react-router-dom',
  );
  return {
    ...router,
    useLocation: vi.fn(),
  };
});

const mockUseLocation = vi.mocked(useLocation);

type TestCase = {
  pathName: string;
  productType: ProductType | null;
};

const testCases: TestCase[] = [
  {
    pathName: '/key-management-service/other/segment',
    productType: 'key-management-service',
  },
  {
    pathName: '/secret-manager/other/segment',
    productType: 'secret-manager',
  },
  {
    pathName: '/not-a-product/other/segment',
    productType: null,
  },
];

describe('useProductType test suite', () => {
  it.each(testCases)(
    'should return the correct productType: $productType for pathName: $pathName',
    ({ pathName, productType }) => {
      // GIVEN pathName
      mockUseLocation.mockReturnValue({
        pathname: pathName,
        hash: '',
        key: '',
        state: '',
        search: '',
      });

      // WHEN
      const { result } = renderHook(() => useProductType());

      // THEN
      expect(result.current).toBe(productType);
    },
  );
});
