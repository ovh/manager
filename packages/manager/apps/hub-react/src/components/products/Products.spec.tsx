import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Products from '@/components/products/Products.component';
import { ProductList } from '@/types/services.type';
import { aFewProductsMocked, lotsOfProductsMocked } from '@/_mock_/products';

const trackClickMock = vi.fn();
const url = 'https://fake-link.com';

vi.mock('react-router-dom', async (importOriginal) => {
  const original: typeof import('react-router-dom') = await importOriginal();
  return {
    ...original,
    useSearchParams: () => [{ get: (str: string) => str }],
    useMatches: vi.fn(() => [
      {
        data: 'foo',
        handle: {
          crumb: (i: string) => `crumb-${i}`,
        },
      },
      {
        data: 'bar',
        handle: {
          crumb: (i: string) => `crumb-${i}`,
        },
      },
      {
        data: 'baz',
        handle: {},
      },
    ]),
  };
});

vi.mock('@ovh-ux/manager-react-shell-client', async (importOriginal) => {
  const original: typeof import('@ovh-ux/manager-react-shell-client') = await importOriginal();
  return {
    ...original,
    useOvhTracking: () => ({ trackClick: trackClickMock }),
  };
});

const shellContext = {
  environment: {
    getRegion: vi.fn(() => 'EU'),
  },
  shell: {
    navigation: {
      getURL: vi.fn(
        () =>
          new Promise((resolve) => {
            setTimeout(() => resolve(url), 50);
          }),
      ),
    },
  },
};
const queryClient = new QueryClient();

const renderComponent = (services: ProductList) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <ShellContext.Provider
        value={(shellContext as unknown) as ShellContextType}
      >
        <Products services={{ status: 'OK', data: services }}></Products>
      </ShellContext.Provider>
    </QueryClientProvider>,
  );
};

describe('Products.component', () => {
  it('should display a skeleton while loading', async () => {
    const { getByTestId } = renderComponent({ count: 3, data: {} });

    const container = getByTestId('products-list-container');

    expect(container.children.length).toBe(0);
  });

  it('should display nothing if user has no services', async () => {
    const { getByTestId } = renderComponent({ count: 3, data: {} });

    const container = getByTestId('products-list-container');

    expect(container.children.length).toBe(0);
  });

  it('should display correctly a single product with a single service', async () => {
    const [productName] = Object.keys(aFewProductsMocked.data);
    const {
      getByText,
      getByTestId,
      findByTestId,
      queryByTestId,
    } = renderComponent(aFewProductsMocked);

    const productAnchor = await findByTestId('product_link');
    const servicesList = getByTestId('product_services_list');

    expect(getByTestId('products_title')).not.toBeNull();
    expect(getByText(`manager_hub_products_${productName}`)).not.toBeNull();
    expect(getByText('displayName1')).not.toBeNull();
    expect(servicesList).not.toBeNull();
    expect(servicesList.children.length).toBe(1);
    expect(queryByTestId('expand_link')).not.toBeInTheDocument();
    expect(productAnchor).not.toBeNull();
    expect(productAnchor).toHaveAttribute('href', url);

    await act(() => fireEvent.click(productAnchor));

    expect(trackClickMock).toHaveBeenCalledWith({
      actionType: 'action',
      actions: [
        'product',
        productName.toLowerCase().replace(/_/g, '-'),
        'show-all',
      ],
    });

    const serviceAnchor = await findByTestId('service_link');

    await act(() => fireEvent.click(serviceAnchor));

    expect(trackClickMock).toHaveBeenCalledWith({
      actionType: 'action',
      actions: [
        'product',
        productName.toLowerCase().replace(/_/g, '-'),
        'go-to-service',
      ],
    });
  });

  it('should call onClick when link is clicked', async () => {
    const { getByTestId, getByText, findByTestId } = renderComponent(
      lotsOfProductsMocked,
    );

    const expandLink = await findByTestId('expand_link');
    const productsList = getByTestId('products-list-container');

    expect(productsList).not.toBeNull();
    expect(productsList.children.length).toBe(6);
    expect(getByText('cdn_dedicated_3')).not.toBeNull();

    await act(() => fireEvent.click(expandLink));

    expect(trackClickMock).toHaveBeenCalledWith({
      actionType: 'action',
      actions: ['product', 'show_more'],
    });

    expect(productsList.children.length).toBe(
      Object.keys(lotsOfProductsMocked.data).length,
    );
  });
});
