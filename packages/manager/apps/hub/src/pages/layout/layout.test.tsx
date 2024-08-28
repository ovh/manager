import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom';
import * as reactShellClientModule from '@ovh-ux/manager-react-shell-client';
import {
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
import Layout from '@/pages/layout/layout';
import { ApiEnvelope } from '@/types/apiEnvelope.type';
import { ProductList } from '@/types/services.type';
import { LastOrder } from '@/types/lastOrder.type';

const services: ApiEnvelope<ProductList> = {
  data: { count: 0, data: {} },
  status: 'OK',
};
const lastOrder: LastOrder = { data: null, status: 'OK' };
let isLastOrderLoading = true;
let isAccountSidebarVisible = false;

const shellContext = {
  environment: {
    getUser: vi.fn(),
  },
  shell: {
    ux: {
      hidePreloader: vi.fn(),
      isAccountSidebarVisible: () => isAccountSidebarVisible,
    },
  },
};

const renderComponent = () => {
  return render(
    <ShellContext.Provider
      value={(shellContext as unknown) as ShellContextType}
    >
      <Layout />
    </ShellContext.Provider>,
  );
};

vi.mock('react-router-dom', () => ({
  useLocation: () => ({}),
}));

vi.mock('@/components/welcome/Welcome.component', () => ({
  default: () => <div>Welcome</div>,
}));

vi.mock('@/components/banner/Banner.component', () => ({
  default: () => <div>Banner</div>,
}));

vi.mock('@/components/products/Products.component', () => ({
  default: () => <div>Products</div>,
}));

vi.mock('@ovh-ux/manager-react-shell-client', async (importOriginal) => {
  const original: typeof reactShellClientModule = await importOriginal();
  return {
    ...original,
    useOvhTracking: vi.fn(() => ({
      trackPage: vi.fn(),
      trackClick: vi.fn(),
      trackCurrentPage: vi.fn(),
      usePageTracking: vi.fn(),
    })),
    useRouteSynchro: vi.fn(() => {}),
  };
});
vi.mock('@/data/hooks/services/useServices', () => ({
  useFetchHubServices: (): {
    data: ApiEnvelope<ProductList>;
    isPending: boolean;
  } => ({ data: services, isPending: false }),
}));

vi.mock('@/data/hooks/lastOrder/useLastOrder', () => ({
  useFetchHubLastOrder: (): { data: LastOrder; isPending: boolean } => ({
    data: lastOrder,
    isPending: isLastOrderLoading,
  }),
}));

describe('Layout.page', () => {
  it('should render skeletons while loading', async () => {
    const { getByTestId, findByTestId } = renderComponent();

    expect(getByTestId('welcome_skeleton')).not.toBeNull();
    expect(getByTestId('banners_skeleton')).not.toBeNull();
    const tileGridTitleSkeleton = await findByTestId(
      'tile_grid_title_skeleton',
    );
    const tileGridContentSkeleton = await findByTestId(
      'tile_grid_content_skeletons',
    );
    expect(tileGridTitleSkeleton).not.toBeNull();
    expect(tileGridContentSkeleton).not.toBeNull();
  });

  it('should render correct components for "fresh" customers', async () => {
    isLastOrderLoading = false;
    const { getByText, queryByText, findByText } = renderComponent();

    const welcome = await findByText('Welcome');

    expect(welcome).not.toBeNull();
    expect(queryByText('Banner')).not.toBeInTheDocument();
    expect(queryByText('ovh-manager-hub-carousel')).not.toBeInTheDocument();
    expect(queryByText('oui-message.siret')).not.toBeInTheDocument();
    expect(queryByText('oui-modal.siret')).not.toBeInTheDocument();
    expect(getByText('oui-message.kycIndia')).not.toBeNull();
    expect(getByText('oui-message.kycFraud')).not.toBeNull();
    expect(getByText('hub-payment-status')).not.toBeNull();
    expect(
      queryByText('hub-enterprise-billing-summary & hub-billing-summary'),
    ).not.toBeInTheDocument();
    expect(queryByText('ovh-manager-hub-support')).not.toBeInTheDocument();
    expect(queryByText('hub-order-tracking')).not.toBeInTheDocument();
    expect(queryByText('Products')).not.toBeInTheDocument();
    expect(getByText('hub-catalog-items')).not.toBeNull();
  });

  it('should render correct components for customers with services or order', async () => {
    lastOrder.data = {
      date: '2024-08-22T12:24:08+02:00',
      expirationDate: '2024-09-05T23:29:59+02:00',
      orderId: 99999999999,
      password: 'fakepassword',
      pdfUrl:
        'https://www.fake-order-url.com?orderId=fakeId&orderPassword=fakePassword',
      priceWithTax: {
        currencyCode: 'points',
        text: '0 PTS',
        value: 0,
      },
      priceWithoutTax: {
        currencyCode: 'points',
        text: '0 PTS',
        value: 0,
      },
      retractionDate: '2024-09-06T00:00:00+02:00',
      tax: {
        currencyCode: 'points',
        text: '0 PTS',
        value: 0,
      },
      url:
        'https://www.fake-order-url.com?orderId=fakeId&orderPassword=fakePassword',
    };
    const {
      getByText,
      queryByText,
      findByText,
      getByTestId,
    } = renderComponent();

    expect(getByTestId('banner_skeleton')).not.toBeNull();

    const welcome = await findByText('Welcome');
    const banner = await findByText('Banner');

    expect(welcome).not.toBeNull();
    expect(banner).not.toBeNull();
    expect(getByText('ovh-manager-hub-carousel')).not.toBeNull();
    expect(getByText('oui-message.siret')).not.toBeNull();
    expect(getByText('oui-modal.siret')).not.toBeNull();
    expect(getByText('oui-message.kycIndia')).not.toBeNull();
    expect(getByText('oui-message.kycFraud')).not.toBeNull();
    expect(getByText('hub-payment-status')).not.toBeNull();
    expect(
      getByText('hub-enterprise-billing-summary & hub-billing-summary'),
    ).not.toBeNull();
    expect(getByText('ovh-manager-hub-support')).not.toBeNull();
    expect(getByText('hub-order-tracking')).not.toBeNull();
    expect(getByText('Products')).not.toBeNull();
    expect(queryByText('hub-catalog-items')).not.toBeInTheDocument();
  });

  it('should have correct css class if account sidebard is closed', async () => {
    const { getByTestId } = renderComponent();

    expect(getByTestId('hub_main_div')).toHaveAttribute(
      'class',
      'absolute hub-main w-full h-full ',
    );
  });

  it('should have correct css class if account sidebard is open', async () => {
    isAccountSidebarVisible = true;
    const { getByTestId } = renderComponent();

    expect(getByTestId('hub_main_div')).toHaveAttribute(
      'class',
      'absolute hub-main w-full h-full hub-main-view_sidebar_expanded',
    );
  });

  it('should have correct css class if account sidebard is open', async () => {
    const { getByTestId } = renderComponent();

    // This is a workaround to overcome this jsdom issue: https://github.com/jsdom/jsdom/issues/1695
    const scrollIntoView = vi.fn();
    Element.prototype.scrollIntoView = scrollIntoView;

    const button = getByTestId('skipnav_button');
    await act(() => fireEvent.click(button));

    expect(scrollIntoView).toHaveBeenCalled();
  });
});
