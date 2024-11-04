import React, { PropsWithChildren } from 'react';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import {
  ShellContext,
  ShellContextType,
  useRouteSynchro,
} from '@ovh-ux/manager-react-shell-client';
import { useProducts } from '@/hooks/products/useProducts';
import {
  lotsOfProductsMocked,
  lotsOfProductsParsedExpandedMocked,
  lotsOfProductsParsedMocked,
} from '@/_mock_/products';

const shellContext = {
  environment: {
    getRegion: vi.fn(() => 'EU'),
  },
  shell: {
    navigation: {
      getURL: vi.fn(() => Promise.resolve('https://fake-link.com')),
    },
  },
};

const wrapper = ({ children }: PropsWithChildren) => (
  <ShellContext.Provider value={(shellContext as unknown) as ShellContextType}>
    {children}
  </ShellContext.Provider>
);

describe('useProducts', () => {
  it('returns non expanded products list', async () => {
    const { result } = renderHook(
      () => useProducts(lotsOfProductsMocked, false),
      {
        wrapper,
      },
    );

    await waitFor(() => {
      expect(result.current.products).toEqual(lotsOfProductsParsedMocked);
    });
  });

  it('returns expanded products list', async () => {
    const { result } = renderHook(
      () => useProducts(lotsOfProductsMocked, true),
      {
        wrapper,
      },
    );

    await waitFor(() => {
      expect(result.current.products).toEqual(
        lotsOfProductsParsedExpandedMocked,
      );
    });
  });

  it('returns a product with no link if it is unknown', async () => {
    const { result } = renderHook(
      () =>
        useProducts(
          {
            count: 1,
            data: {
              fakeProduct: {
                count: 1,
                data: [
                  {
                    propertyId: 'name',
                    resource: {
                      displayName: 'fake_service',
                      name: 'fake_service',
                      resellingProvider: null,
                      state: 'toSuspend',
                    },
                    route: {
                      path: '/dedicated/housing/{serviceName}',
                    },
                    serviceId: 1,
                    universe: {
                      CA: 'dedicated',
                      EU: 'dedicated',
                      US: 'dedicated',
                    },
                    url:
                      'https://www.ovh.com/manager/#/dedicated/configuration/fake_product/fake_service',
                  },
                ],
              },
            },
          },
          true,
        ),
      {
        wrapper,
      },
    );

    await waitFor(() => {
      expect(result.current.products[0].link).toBeNull();
    });
  });

  it('returns an empty array if services parameters is falsy', async () => {
    const { result } = renderHook(() => useProducts(null, true), {
      wrapper,
    });

    await waitFor(() => {
      expect(result.current.products.length).toBe(0);
    });
  });
});
