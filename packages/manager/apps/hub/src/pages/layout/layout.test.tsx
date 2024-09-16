import React, { ReactNode } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as reactShellClientModule from '@ovh-ux/manager-react-shell-client';
import {
  ShellContext,
  ShellContextType,
} from '@ovh-ux/manager-react-shell-client';
import {
  OdsSelectValueChangeEventDetail,
  OsdsSelect,
} from '@ovhcloud/ods-components';
import Layout from '@/pages/layout/layout';
import { ApiEnvelope } from '@/types/apiEnvelope.type';
import { ProductList } from '@/types/services.type';
import { LastOrder } from '@/types/lastOrder.type';
import BillingSummary from '@/pages/layout/BillingSummary.component';
import * as UseBillsHook from '@/data/hooks/bills/useBills';
import EnterpriseBillingSummary from '@/pages/layout/EnterpriseBillingSummary.component';

const queryClient = new QueryClient();

const services: ApiEnvelope<ProductList> = {
  data: { count: 0, data: {} },
  status: 'OK',
};
const lastOrder: LastOrder = { data: null, status: 'OK' };
const trackClickMock = vi.fn();
let isLastOrderLoading = true;
let isAccountSidebarVisible = false;
const mockedLocale = 'fr_FR';

const shellContext = {
  environment: {
    user: {
      enterprise: false,
    },
    getUser: vi.fn(() => ({
      currency: {
        code: 'USD',
      },
    })),
    getUserLocale: vi.fn(() => mockedLocale),
  },
  shell: {
    ux: {
      hidePreloader: vi.fn(),
      stopProgress: vi.fn(),
      isAccountSidebarVisible: () => isAccountSidebarVisible,
    },
    navigation: {
      getURL: vi.fn(),
    },
  },
};

const renderComponent = (component: ReactNode) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <ShellContext.Provider
        value={(shellContext as unknown) as ShellContextType}
      >
        {component}
      </ShellContext.Provider>
    </QueryClientProvider>,
  );
};

vi.mock('react-router-dom', async (importOriginal) => {
  const original: typeof reactShellClientModule = await importOriginal();
  return {
    ...original,
    useLocation: () => ({}),
  };
});

vi.mock('@/components/welcome/Welcome.component', () => ({
  default: () => <div>Welcome</div>,
}));

vi.mock('@/components/banner/Banner.component', () => ({
  default: () => <div>Banner</div>,
}));

vi.mock('@/components/products/Products.component', () => ({
  default: () => <div>Products</div>,
}));

vi.mock('@/components/hub-support/HubSupport.component', () => ({
  default: () => <div>Support</div>,
}));

vi.mock('@/components/hub-order-tracking/HubOrderTracking.component', () => ({
  default: () => <div>Order Tracking</div>,
}));

vi.mock('@ovh-ux/manager-react-shell-client', async (importOriginal) => {
  const original: typeof reactShellClientModule = await importOriginal();
  return {
    ...original,
    useOvhTracking: vi.fn(() => ({
      trackPage: vi.fn(),
      trackClick: trackClickMock,
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

const useBillsMockValue: any = {
  data: {
    currency: {
      code: 'EUR',
      format: '{{price}} €',
      symbol: '€',
    },
    period: { from: '2024-08-01', to: '2024-08-31' },
    total: 0,
  },
  isPending: true,
  error: null,
  refetch: vi.fn(() => ({})),
};
const useFetchHubBillsSpy = vi
  .spyOn(UseBillsHook, 'useFetchHubBills')
  .mockReturnValue(useBillsMockValue);

const useDebtMockValue: any = {
  data: {
    unmaturedAmount: {
      currencyCode: 'EUR',
      value: 0,
      text: '0.00 €',
    },
    active: false,
    dueAmount: {
      currencyCode: 'EUR',
      text: '0.00 €',
      value: 0,
    },
    pendingAmount: {
      currencyCode: 'EUR',
      text: '0.00 €',
      value: 0,
    },
    todoAmount: {
      text: '0.00 €',
      value: 0,
      currencyCode: 'EUR',
    },
  },
  isPending: false,
  refetch: vi.fn(() => ({})),
};
vi.mock('@/data/hooks/debt/useDebt', () => ({
  useFetchHubDebt: vi.fn(() => useDebtMockValue),
}));

const intlSpy = vi.spyOn(Intl, 'NumberFormat');

describe('Layout.page', () => {
  it('should render skeletons while loading', async () => {
    const { getByTestId, findByTestId } = renderComponent(<Layout />);

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
    const { getByText, queryByText, findByText } = renderComponent(<Layout />);

    const welcome = await findByText('Welcome');

    expect(welcome).not.toBeNull();
    expect(queryByText('Banner')).not.toBeInTheDocument();
    expect(queryByText('ovh-manager-hub-carousel')).not.toBeInTheDocument();
    expect(queryByText('oui-message.siret')).not.toBeInTheDocument();
    expect(queryByText('oui-modal.siret')).not.toBeInTheDocument();
    expect(getByText('oui-message.kycIndia')).not.toBeNull();
    expect(getByText('oui-message.kycFraud')).not.toBeNull();
    expect(getByText('hub-payment-status')).not.toBeNull();
    expect(queryByText('Support')).not.toBeInTheDocument();
    expect(queryByText('Order Tracking')).not.toBeInTheDocument();
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
      getByTestId,
      queryByText,
      findByText,
      findByTestId,
    } = renderComponent(<Layout />);

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
    expect(getByText('Support')).not.toBeNull();
    expect(getByText('Order Tracking')).not.toBeNull();
    expect(getByText('Products')).not.toBeNull();
    expect(queryByText('hub-catalog-items')).not.toBeInTheDocument();

    const billingSummary = await findByTestId('billing_summary');
    expect(billingSummary).not.toBeNull();
  });

  it('should have correct css class if account sidebard is closed', async () => {
    const { getByTestId } = renderComponent(<Layout />);

    expect(getByTestId('hub_main_div')).toHaveAttribute(
      'class',
      'absolute hub-main w-full h-full ',
    );
  });

  it('should have correct css class if account sidebard is open', async () => {
    isAccountSidebarVisible = true;
    const { getByTestId } = renderComponent(<Layout />);

    expect(getByTestId('hub_main_div')).toHaveAttribute(
      'class',
      'absolute hub-main w-full h-full hub-main-view_sidebar_expanded',
    );
  });

  it('should scroll into view skipnav button is clicked', async () => {
    const { getByTestId } = renderComponent(<Layout />);

    // This is a workaround to overcome this jsdom issue: https://github.com/jsdom/jsdom/issues/1695
    const scrollIntoView = vi.fn();
    Element.prototype.scrollIntoView = scrollIntoView;

    const button = getByTestId('skipnav_button');
    await act(() => fireEvent.click(button));

    expect(scrollIntoView).toHaveBeenCalled();
  });

  it('should display enterprise billing summary if customer is enterprise', async () => {
    shellContext.environment.user.enterprise = true;
    const { findByTestId } = renderComponent(<Layout />);

    const enterpriseBillingSummary = await findByTestId(
      'enterprise_billing_summary',
    );
    expect(enterpriseBillingSummary).not.toBeNull();
  });

  describe('BillingSummary component', () => {
    it('should render skeletons while loading', async () => {
      const { getByText, getByTestId } = renderComponent(<BillingSummary />);

      expect(getByText('hub_billing_summary_title')).not.toBeNull();
      expect(getByTestId('bills_status_skeleton')).not.toBeNull();
      expect(getByTestId('bills_period_selector')).not.toBeNull();
      expect(getByTestId('bills_link_skeleton')).not.toBeNull();
    });

    it('should display correct wording when customer has no bills', async () => {
      useBillsMockValue.isPending = false;
      const { getByText, queryByTestId } = renderComponent(<BillingSummary />);

      expect(getByText('hub_billing_summary_debt_no_bills')).not.toBeNull();
      const link = await queryByTestId('bills_link');
      expect(link).not.toBeNull();
    });

    it('should display correct wording when customer has bills but no debt', async () => {
      useBillsMockValue.data.total = 15034.94;
      const expectedAmount = '15\u202f034';
      const { getByText, getByTestId, getAllByTestId } = renderComponent(
        <BillingSummary />,
      );

      const amount = getAllByTestId('bills_amount_container');
      expect(amount.length).toBe(1);
      expect(amount[0].innerHTML.includes(expectedAmount)).toBe(true);

      expect(getByTestId('bills_amount_container')).not.toBeNull();
      expect(getByText('hub_billing_summary_debt_null')).not.toBeNull();
      await waitFor(() => {
        expect(intlSpy).toHaveBeenCalledWith('fr-FR', {
          style: 'currency',
          currency: useBillsMockValue.data.currency.code,
        });
      });
    });

    it('should update bills amount when period is changed', async () => {
      const { getByTestId } = renderComponent(<BillingSummary />);
      const periodSelector = (getByTestId(
        'bills_period_selector',
      ) as unknown) as OsdsSelect;

      await act(() =>
        periodSelector.odsValueChange.emit({
          value: '3',
        } as OdsSelectValueChangeEventDetail),
      );

      await waitFor(() => {
        expect(useFetchHubBillsSpy).toHaveBeenCalledWith(3);
      });
    });

    it('should track click on bills link', async () => {
      const { getByTestId } = renderComponent(<BillingSummary />);

      const link = getByTestId('bills_link');
      await act(() => fireEvent.click(link));

      expect(trackClickMock).toHaveBeenCalledWith({
        actionType: 'action',
        actions: ['activity', 'billing', 'show-all'],
      });
    });

    it('should display debt information if customer has debt', async () => {
      useDebtMockValue.data.dueAmount.value = 964.23;
      const { getByTestId, findByTestId } = renderComponent(<BillingSummary />);
      expect(getByTestId('debt_amount')).not.toBeNull();

      const link = await findByTestId('debt_link');
      expect(link).not.toBeNull();
    });

    it('should display error tile', async () => {
      useBillsMockValue.error = new Error();
      const { findByText } = renderComponent(<BillingSummary />);
      const tileError = await findByText('manager_error_tile_title');
      expect(tileError).not.toBeNull();
    });
  });

  describe('EnterpriseBillingSummary component', () => {
    it('should render title, description and tracked link', async () => {
      const { getByTestId } = renderComponent(<EnterpriseBillingSummary />);

      expect(getByTestId('enterprise_billing_summary')).not.toBeNull();
      expect(getByTestId('enterprise_billing_summary_title')).not.toBeNull();
      expect(
        getByTestId('enterprise_billing_summary_description'),
      ).not.toBeNull();
      const link = getByTestId('enterprise_billing_summary_link');
      expect(link).not.toBeNull();

      await act(() => fireEvent.click(link));

      expect(trackClickMock).toHaveBeenCalledWith({
        actionType: 'action',
        actions: ['activity', 'billing', 'show-all'],
      });
    });
  });
});
