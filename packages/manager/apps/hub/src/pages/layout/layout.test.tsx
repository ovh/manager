import { ReactNode } from 'react';
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
import { User } from '@ovh-ux/manager-config';
import Layout from '@/pages/layout/layout';
import { ApiEnvelope } from '@/types/apiEnvelope.type';
import { ProductList } from '@/types/services.type';
import { LastOrder } from '@/types/lastOrder.type';
import BillingSummary from '@/pages/layout/BillingSummary.component';
import * as UseBillsHook from '@/data/hooks/bills/useBills';
import * as UseBillingServicesHook from '@/data/hooks/billingServices/useBillingServices';
import EnterpriseBillingSummary from '@/pages/layout/EnterpriseBillingSummary.component';
import PaymentStatus from '@/pages/layout/PaymentStatus.component';
import {
  FourServices,
  NoServices,
  TwoServices,
} from '@/_mock_/billingServices';
import SiretBanner from '@/pages/layout/SiretBanner.component';
import SiretModal from '@/pages/layout/SiretModal.component';
import KycIndiaBanner from '@/pages/layout/KycIndiaBanner.component';
import KycFraudBanner from '@/pages/layout/KycFraudBanner.component';
import { KycStatus } from '@/types/kyc.type';

const queryClient = new QueryClient();

const trackClickMock = vi.fn();
const trackPageMock = vi.fn();
const trackImpressionMock = vi.fn();
const trackClickImpressionMock = vi.fn();
const mocks = vi.hoisted(() => ({
  bills: {
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
  },
  debt: {
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
  },
  featureAvailability: {
    'billing:management': false,
    'hub:banner-hub-invite-customer-siret': true,
    'hub:popup-hub-invite-customer-siret': true,
    'identity-documents': true,
    'procedures:fraud': true,
  },
  isLastOrderLoading: true,
  isAccountSidebarVisible: false,
  lastOrder: {
    data: null,
    status: 'OK',
  } as LastOrder,
  locale: 'fr_FR',
  kycStatus: {
    status: 'required',
  } as KycStatus,
  region: 'EU',
  services: {
    data: { count: 0, data: {} },
    status: 'OK',
  },
}));
const services: ApiEnvelope<ProductList> = {
  data: { count: 0, data: {} },
  status: 'OK',
};

const shellContext = {
  environment: {
    user: {
      enterprise: false,
      companyNationalIdentificationNumber: null,
      legalform: 'corporation',
      country: 'FR',
    } as User,
    getUser: vi.fn(() => ({
      currency: {
        code: 'USD',
      },
    })),
    getUserLocale: vi.fn(() => mocks.locale),
    getRegion: vi.fn(() => mocks.region),
  },
  shell: {
    ux: {
      hidePreloader: vi.fn(),
      stopProgress: vi.fn(),
      isAccountSidebarVisible: () => mocks.isAccountSidebarVisible,
    },
    navigation: {
      getURL: vi.fn(
        () =>
          new Promise((resolve) =>
            setTimeout(() => resolve('https://fake-link.com'), 50),
          ),
      ),
      tracking: {
        trackImpression: trackImpressionMock,
        trackClickImpression: trackClickImpressionMock,
      },
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

vi.mock('@ovh-ux/request-tagger', () => ({
  defineCurrentPage: () => ({}),
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

vi.mock('@/components/hub-support/HubSupport.component', () => ({
  default: () => <div>Support</div>,
}));

vi.mock('@/components/hub-order-tracking/HubOrderTracking.component', () => ({
  default: () => <div>Order Tracking</div>,
}));

vi.mock('@/pages/layout/BillingSummary.component', () => ({
  default: () => <div>Billing Summary</div>,
}));

vi.mock('@/pages/layout/EnterpriseBillingSummary.component', () => ({
  default: () => <div>Enterprise Billing Summary</div>,
}));

vi.mock('@/billing/components/billing-status/BillingStatus.component', () => ({
  default: () => <div>Billing Status</div>,
}));

vi.mock(
  '@/billing/components/services-actions/ServicesActions.component',
  () => ({
    default: () => <div>Service Actions</div>,
  }),
);

vi.mock('@/pages/layout/PaymentStatus.component', () => ({
  default: () => <div>Payment Status</div>,
}));

vi.mock('@ovh-ux/manager-react-shell-client', async (importOriginal) => {
  const original: typeof reactShellClientModule = await importOriginal();
  return {
    ...original,
    useOvhTracking: vi.fn(() => ({
      trackPage: trackPageMock,
      trackClick: trackClickMock,
      trackCurrentPage: vi.fn(),
      usePageTracking: vi.fn(),
    })),
    useRouteSynchro: vi.fn(() => {}),
  };
});

vi.mock('@ovh-ux/manager-react-components', () => ({
  useFeatureAvailability: (
    features: string[],
  ): {
    data: typeof featuresAvailability;
    isPending: boolean;
  } => ({ data: featuresAvailability, isPending: false }),
}));

vi.mock('@/data/hooks/services/useServices', () => ({
  useFetchHubServices: (): {
    data: ApiEnvelope<ProductList>;
    isPending: boolean;
  } => ({ data: mocks.services, isPending: false }),
}));

vi.mock('@/data/hooks/lastOrder/useLastOrder', () => ({
  useFetchHubLastOrder: (): { data: LastOrder; isPending: boolean } => ({
    data: mocks.lastOrder,
    isPending: mocks.isLastOrderLoading,
  }),
}));

vi.mock('@ovh-ux/manager-react-components', () => ({
  useFeatureAvailability: (): { data: any; isPending: boolean } => ({
    data: mocks.featureAvailability,
    isPending: false,
  }),
}));
vi.mock('@/data/hooks/bills/useBills', () => ({
  useFetchHubBills: vi.fn(() => mocks.bills),
}));
vi.mock('@/data/hooks/debt/useDebt', () => ({
  useFetchHubDebt: vi.fn(() => mocks.debt),
}));

vi.mock('@/data/hooks/kyc/useKyc', () => ({
  useKyc: () => ({
    useKycStatus: () => ({ data: mocks.kycStatus }),
  }),
}));

const useBillingServicesMockValue: any = {
  data: null,
  isLoading: true,
  error: null,
};
vi.spyOn(UseBillingServicesHook, 'useFetchHubBillingServices').mockReturnValue(
  useBillingServicesMockValue,
);

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
    mocks.isLastOrderLoading = false;
    const {
      getByText,
      queryByText,
      findByText,
      findByTestId,
      queryByTestId,
    } = renderComponent(<Layout />);

    const welcome = await findByText('Welcome');

    expect(welcome).not.toBeNull();
    expect(queryByText('Banner')).not.toBeInTheDocument();
    expect(queryByText('ovh-manager-hub-carousel')).not.toBeInTheDocument();
    expect(queryByTestId('siret_banner')).not.toBeInTheDocument();
    expect(queryByTestId('siret_modal')).not.toBeInTheDocument();
    expect(queryByText('Payment Status')).not.toBeInTheDocument();
    expect(queryByText('Support')).not.toBeInTheDocument();
    expect(queryByText('Order Tracking')).not.toBeInTheDocument();
    expect(queryByText('Products')).not.toBeInTheDocument();
    expect(getByText('hub-catalog-items')).not.toBeNull();

    const kycIndiaBanner = await findByTestId('kyc_india_banner');
    const kycFraudBanner = await findByTestId('kyc_fraud_banner');
    expect(kycIndiaBanner).not.toBeNull();
    expect(kycFraudBanner).not.toBeNull();
  });

  it('should render correct components for customers with services or order', async () => {
    mocks.lastOrder.data = {
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
    expect(getByTestId('siret_banner')).not.toBeNull();
    expect(getByTestId('siret_modal')).not.toBeNull();
    expect(getByTestId('kyc_india_banner')).not.toBeNull();
    expect(getByTestId('kyc_fraud_banner')).not.toBeNull();
    expect(getByText('Support')).not.toBeNull();
    expect(getByText('Order Tracking')).not.toBeNull();
    expect(getByText('Products')).not.toBeNull();
    expect(queryByText('hub-catalog-items')).not.toBeInTheDocument();

    const billingSummary = await findByTestId('billing_summary');
    const paymentStatus = await findByTestId('payment_status');
    const siretBanner = await findByTestId('siret_banner');
    const siretModal = await findByTestId('siret_modal');
    expect(billingSummary).not.toBeNull();
    expect(paymentStatus).not.toBeNull();
    expect(siretBanner).not.toBeNull();
    expect(siretModal).not.toBeNull();
  });

  it('should have correct css class if account sidebard is closed', async () => {
    const { getByTestId } = renderComponent(<Layout />);

    expect(getByTestId('hub_main_div')).toHaveAttribute(
      'class',
      'absolute hub-main w-full h-full ',
    );
  });

  it('should have correct css class if account sidebard is open', async () => {
    mocks.isAccountSidebarVisible = true;
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
    vi.unmock('@/pages/layout/BillingSummary.component');

    it('should render skeletons while loading', async () => {
      const { getByText, getByTestId } = renderComponent(<BillingSummary />);

      expect(getByText('hub_billing_summary_title')).not.toBeNull();
      expect(getByTestId('bills_status_skeleton')).not.toBeNull();
      expect(getByTestId('bills_period_selector')).not.toBeNull();
      expect(getByTestId('bills_link_skeleton')).not.toBeNull();
    });

    it('should display correct wording when customer has no bills', async () => {
      mocks.bills.isPending = false;
      const { findByTestId, getByText, getByTestId } = renderComponent(
        <BillingSummary />,
      );

      expect(getByText('hub_billing_summary_debt_no_bills')).not.toBeNull();
      expect(getByTestId('bills_link_skeleton')).not.toBeNull();
      const link = await findByTestId('bills_link');
      expect(link).not.toBeNull();
    });

    it('should display correct wording when customer has bills but no debt', async () => {
      mocks.bills.data.total = 15034.94;
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
          currency: mocks.bills.data.currency.code,
        });
      });
    });

    it('should update bills amount when period is changed', async () => {
      const useFetchHubBillsSpy = vi.spyOn(UseBillsHook, 'useFetchHubBills');
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
      const { findByTestId, getByTestId } = renderComponent(<BillingSummary />);

      expect(getByTestId('bills_link_skeleton')).not.toBeNull();
      const link = await findByTestId('bills_link');
      await act(() => fireEvent.click(link));

      expect(trackClickMock).toHaveBeenCalledWith({
        actionType: 'action',
        actions: ['activity', 'billing', 'show-all'],
      });
    });

    it('should display debt information if customer has debt', async () => {
      mocks.debt.data.dueAmount.value = 964.23;
      const { getByTestId, findByTestId } = renderComponent(<BillingSummary />);
      expect(getByTestId('debt_amount')).not.toBeNull();

      const link = await findByTestId('debt_link');
      expect(link).not.toBeNull();
    });

    it('should display error tile', async () => {
      mocks.bills.error = new Error();
      const { findByText } = renderComponent(<BillingSummary />);
      const tileError = await findByText('manager_error_tile_title');
      expect(tileError).not.toBeNull();
    });
  });

  describe('EnterpriseBillingSummary component', () => {
    vi.unmock('@/pages/layout/EnterpriseBillingSummary.component');

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

  describe('PaymentStatus component', () => {
    vi.unmock('@/pages/layout/PaymentStatus.component');
    it('should render title and badge', async () => {
      const { findByTestId, getByTestId } = renderComponent(
        <PaymentStatus canManageBilling={true} />,
      );

      expect(getByTestId('payment_status_title')).not.toBeNull();
      expect(getByTestId('payment_status_badge')).not.toBeNull();
      expect(getByTestId('my_services_link_skeleton')).not.toBeNull();

      const myServiceLink = await findByTestId('my_services_link');
      expect(myServiceLink).not.toBeNull();
    });

    it('should render table with skeletons while loading', async () => {
      const { getAllByTestId, getByTestId } = renderComponent(
        <PaymentStatus canManageBilling={true} />,
      );

      expect(getByTestId('payment_status_table')).not.toBeNull();
      expect(getAllByTestId('payment_status_skeleton_line').length).toBe(4);
    });

    it('should render error if loading is done and no data has been retrieved', async () => {
      useBillingServicesMockValue.isLoading = false;
      const { findByText } = renderComponent(
        <PaymentStatus canManageBilling={true} />,
      );

      const tileError = await findByText('manager_error_tile_title');
      expect(tileError).not.toBeNull();
    });

    it('should render a message if loading is done and user has no services', async () => {
      useBillingServicesMockValue.data = NoServices;
      const { getByText } = renderComponent(
        <PaymentStatus canManageBilling={true} />,
      );

      expect(
        getByText('ovh_manager_hub_payment_status_tile_no_services'),
      ).not.toBeNull();
    });

    it('should render the correct number of services', async () => {
      useBillingServicesMockValue.data = TwoServices;
      const { findAllByText, getAllByTestId, getByTestId } = renderComponent(
        <PaymentStatus canManageBilling={true} />,
      );

      expect(getByTestId('payment_status_badge').innerHTML.includes('2')).toBe(
        true,
      );
      const servicesLine = getAllByTestId('billing_service');
      expect(servicesLine.length).toBe(2);
      expect(getAllByTestId('billing_status_skeleton').length).toBe(2);
      const servicesStatuses = await findAllByText('Billing Status');
      expect(servicesStatuses.length).toBe(2);
      expect(getAllByTestId('service_expiration_date_message').length).toBe(2);
    });

    it('should display the correct message for service in debt', async () => {
      const { getByTestId } = renderComponent(
        <PaymentStatus canManageBilling={true} />,
      );

      expect(getByTestId('service_with_debt')).not.toBeNull();
    });

    it('should display the correct message for service in automatic renew without debt and not resiliated', async () => {
      const { getByTestId } = renderComponent(
        <PaymentStatus canManageBilling={true} />,
      );

      expect(getByTestId('service_with_expiration_date')).not.toBeNull();
    });

    it('should display service type for each service', async () => {
      useBillingServicesMockValue.data = FourServices;
      const { getByText } = renderComponent(
        <PaymentStatus canManageBilling={true} />,
      );

      expect(getByText('manager_hub_products_HOSTING_WEB')).not.toBeNull();
      expect(getByText('manager_hub_products_DOMAIN')).not.toBeNull();
      expect(getByText('manager_hub_products_DEDICATED_SERVER')).not.toBeNull();
      expect(getByText('manager_hub_products_DEDICATED_CLOUD')).not.toBeNull();
    });

    it('should display the correct information for resiliated service', async () => {
      const { getByTestId, getByText } = renderComponent(
        <PaymentStatus canManageBilling={true} />,
      );
      const serviceLink = getByText('serviceResiliated');
      expect(serviceLink).not.toBeNull();
      expect(serviceLink).toHaveAttribute(
        'href',
        'https://www.ovh.com/manager/#/web/configuration/hosting/serviceResiliated',
      );

      expect(getByTestId('service_with_termination_date')).not.toBeNull();
    });

    it('should display the correct information for service in manual renew without debt and not resiliated', async () => {
      const { getByTestId, getByText } = renderComponent(
        <PaymentStatus canManageBilling={true} />,
      );
      const serviceLink = getByText(
        'serviceWithManualRenewNotResiliatedWithoutDebt',
      );
      expect(serviceLink).not.toBeNull();
      expect(serviceLink).toHaveAttribute(
        'href',
        'https://www.ovh.com/manager/#/web/configuration/domain/serviceWithManualRenewNotResiliatedWithoutDebt/information',
      );

      expect(getByTestId('service_valid_until_date')).not.toBeNull();
    });

    it('should display the correct information for one shot service not resiliated', async () => {
      const { getByTestId, getByText } = renderComponent(
        <PaymentStatus canManageBilling={true} />,
      );
      const serviceLink = getByText('serviceOneShotWithoutResiliation');
      expect(serviceLink).not.toBeNull();
      expect(serviceLink).toHaveAttribute(
        'href',
        'https://www.ovh.com/manager/#/dedicated/server/serviceOneShotWithoutResiliation',
      );

      expect(getByTestId('service_without_expiration_date')).not.toBeNull();
    });

    it('should display the correct information for service without url and billing suspended', async () => {
      const { getByText } = renderComponent(
        <PaymentStatus canManageBilling={true} />,
      );
      const serviceWithoutUrlAndSuspendedBillingLink = getByText(
        'serviceWithoutUrlAndSuspendedBilling',
      );
      expect(serviceWithoutUrlAndSuspendedBillingLink).not.toBeNull();
      expect(serviceWithoutUrlAndSuspendedBillingLink).not.toHaveAttribute(
        'href',
      );
    });

    it('should track service access', async () => {
      const { getByText } = renderComponent(
        <PaymentStatus canManageBilling={true} />,
      );
      const service = getByText(
        'serviceWithManualRenewNotResiliatedWithoutDebt',
      );
      expect(service).not.toBeNull();
      await act(() => fireEvent.click(service));

      expect(trackClickMock).toHaveBeenCalledWith({
        actionType: 'action',
        actions: ['activity', 'payment-status', 'go-to-service'],
      });
    });

    describe('With billing management', () => {
      it('should render "see all" link', async () => {
        const {
          getAllByTestId,
          findAllByText,
          findByTestId,
          getByTestId,
        } = renderComponent(<PaymentStatus canManageBilling={true} />);
        expect(getByTestId('my_services_link_skeleton')).not.toBeNull();
        expect(getAllByTestId('services_actions_skeleton').length).toBe(4);

        const myServiceLink = await findByTestId('my_services_link');
        expect(myServiceLink).not.toBeNull();

        const serviceActionsComponents = await findAllByText('Service Actions');
        expect(serviceActionsComponents).not.toBeNull();
      });
    });

    describe('Without billing management', () => {
      it('should not render "see all" link', async () => {
        const { queryAllByTestId, queryByTestId } = renderComponent(
          <PaymentStatus canManageBilling={false} />,
        );
        expect(
          queryByTestId('my_services_link_skeleton'),
        ).not.toBeInTheDocument();
        expect(queryAllByTestId('services_actions_skeleton').length).toBe(0);
      });
    });
  });

  describe('SiretBanner component', () => {
    it('should render for french company without national company identification number', async () => {
      const { getByText, findByText } = renderComponent(<SiretBanner />);
      expect(getByText('manager_hub_dashboard_banner_siret')).not.toBeNull();
      const link = await findByText('manager_hub_dashboard_banner_siret_link');
      expect(link).not.toBeNull();
    });

    it('should send tracking hit when displayed', async () => {
      trackPageMock.mockReset();
      renderComponent(<SiretBanner />);

      expect(trackPageMock).toHaveBeenCalledWith({
        pageType: 'banner-info',
        pageName: 'siret',
      });
    });

    it('should send tracking hit when clicking on the link', async () => {
      trackClickMock.mockReset();
      const { findByText } = renderComponent(<SiretBanner />);
      const link = await findByText('manager_hub_dashboard_banner_siret_link');
      expect(link).not.toBeNull();
      await act(() => fireEvent.click(link));

      expect(trackClickMock).toHaveBeenCalledWith({
        actionType: 'action',
        actions: ['hub', 'add-siret-banner', 'goto-edit-profile'],
      });
    });

    it('should not be displayed for non company customer', async () => {
      shellContext.environment.user.legalform = 'individual';
      const { queryByTestId } = renderComponent(<SiretBanner />);
      expect(queryByTestId('siret_banner')).not.toBeInTheDocument();
    });

    it('should not be displayed for customer not residing in France', async () => {
      shellContext.environment.user.legalform = 'corporation';
      shellContext.environment.user.country = 'GB';
      const { queryByTestId } = renderComponent(<SiretBanner />);
      expect(queryByTestId('siret_banner')).not.toBeInTheDocument();
    });

    it('should not be displayed for french company with national company identification number', async () => {
      shellContext.environment.user.country = 'FR';
      shellContext.environment.user.companyNationalIdentificationNumber = 99999;
      const { queryByTestId } = renderComponent(<SiretBanner />);
      expect(queryByTestId('siret_banner')).not.toBeInTheDocument();
    });
  });

  describe('SiretModal component', () => {
    it('should render for french company without national company identification number', async () => {
      shellContext.environment.user.companyNationalIdentificationNumber = null;
      const { getByTestId, getByText } = renderComponent(<SiretModal />);
      expect(getByTestId('siret_modal')).not.toBeNull();
      expect(
        getByText('manager_hub_dashboard_modal_siret_part_1'),
      ).not.toBeNull();
      expect(
        getByText('manager_hub_dashboard_modal_siret_part_2'),
      ).not.toBeNull();
      expect(
        getByText('manager_hub_dashboard_modal_siret_cancel'),
      ).not.toBeNull();
      expect(
        getByText('manager_hub_dashboard_modal_siret_link'),
      ).not.toBeNull();
    });

    it('should send tracking hit when displayed', async () => {
      trackPageMock.mockReset();
      renderComponent(<SiretModal />);

      expect(trackPageMock).toHaveBeenCalledWith({
        pageType: 'pop-up',
        pageName: 'siret',
      });
    });

    it('should send tracking hit when clicking on confirmation button', async () => {
      trackClickMock.mockReset();
      const { findByText } = renderComponent(<SiretModal />);
      const confirmLink = await findByText(
        'manager_hub_dashboard_modal_siret_link',
      );
      expect(confirmLink).not.toBeNull();
      await act(() => fireEvent.click(confirmLink));

      expect(trackClickMock).toHaveBeenCalledWith({
        actionType: 'action',
        actions: ['hub', 'add-siret-popup', 'confirm'],
      });
    });

    it('should send tracking hit when clicking and close modal on cancellation button', async () => {
      trackClickMock.mockReset();
      const { findByText, queryByTestId } = renderComponent(<SiretModal />);
      const cancelLink = await findByText(
        'manager_hub_dashboard_modal_siret_cancel',
      );
      expect(cancelLink).not.toBeNull();
      await act(() => fireEvent.click(cancelLink));

      expect(trackClickMock).toHaveBeenCalledWith({
        actionType: 'action',
        actions: ['hub', 'add-siret-popup', 'cancel'],
      });
      expect(queryByTestId('siret_banner')).not.toBeInTheDocument();
    });

    it('should not be displayed for non company customer', async () => {
      shellContext.environment.user.legalform = 'individual';
      const { queryByTestId } = renderComponent(<SiretModal />);
      expect(queryByTestId('siret_modal')).not.toBeInTheDocument();
    });

    it('should not be displayed for customer not residing in France', async () => {
      shellContext.environment.user.legalform = 'corporation';
      shellContext.environment.user.country = 'GB';
      const { queryByTestId } = renderComponent(<SiretModal />);
      expect(queryByTestId('siret_modal')).not.toBeInTheDocument();
    });

    it('should not be displayed for french company with national company identification number', async () => {
      shellContext.environment.user.country = 'FR';
      shellContext.environment.user.companyNationalIdentificationNumber = 99999;
      const { queryByTestId } = renderComponent(<SiretModal />);
      expect(queryByTestId('siret_modal')).not.toBeInTheDocument();
    });
  });

  describe('KycIndiaBanner component', () => {
    it('should render the banner if user is required to validated his KYC', async () => {
      trackClickMock.mockReset();
      const { findByTestId, getByTestId } = renderComponent(<KycIndiaBanner />);
      expect(getByTestId('kyc_india_banner')).not.toBeNull();

      expect(trackPageMock).toHaveBeenCalledWith({
        pageType: 'banner-info',
        pageName: 'kyc-india',
      });
      expect(getByTestId('kyc_india_banner_link_skeleton')).not.toBeNull();
      const link = await findByTestId('kyc_india_link');
      expect(link).not.toBeNull();

      await act(() => fireEvent.click(link));

      expect(trackClickMock).toHaveBeenCalledWith({
        actionType: 'action',
        actions: ['kyc-india', 'verify-identity'],
      });
    });

    it('should render the banner and track display if user has started his KYC validation', async () => {
      mocks.kycStatus.ticketId = 'CS0013982';
      const { getByTestId } = renderComponent(<KycIndiaBanner />);
      expect(getByTestId('kyc_india_banner')).not.toBeNull();
    });

    it('should render nothing if user already validated his KYC', async () => {
      mocks.kycStatus.status = 'ok';
      const { queryByTestId } = renderComponent(<KycIndiaBanner />);
      expect(queryByTestId('kyc_india_banner')).not.toBeInTheDocument();
    });
  });

  describe('KycFraudBanner component', () => {
    it('should render the banner if user is required to validated his KYC', async () => {
      mocks.kycStatus.status = 'required';
      delete mocks.kycStatus.ticketId;
      const { findByTestId, getByTestId } = renderComponent(<KycFraudBanner />);
      expect(getByTestId('kyc_fraud_banner')).not.toBeNull();

      expect(trackImpressionMock).toHaveBeenCalledWith({
        campaignId: 'kyc-fraud',
        creation: 'notification',
        format: 'banner',
        generalPlacement: 'manager-hub',
        variant: 'required',
      });
      const link = await findByTestId('kyc_fraud_link');
      expect(link).not.toBeNull();

      await act(() => fireEvent.click(link));

      expect(trackClickImpressionMock).toHaveBeenCalledWith({
        click: {
          campaignId: 'kyc-fraud',
          creation: 'notification',
          format: 'banner',
          generalPlacement: 'manager-hub',
          variant: 'required',
        },
      });
    });

    it('should render the banner and track display if user has started his KYC validation', async () => {
      trackImpressionMock.mockReset();
      mocks.kycStatus.status = 'open';
      mocks.kycStatus.ticketId = 'CS0013982';
      const { getByTestId } = renderComponent(<KycFraudBanner />);
      expect(getByTestId('kyc_fraud_banner')).not.toBeNull();

      expect(trackImpressionMock).toHaveBeenCalledWith({
        campaignId: 'kyc-fraud',
        creation: 'notification',
        format: 'banner',
        generalPlacement: 'manager-hub',
        variant: 'open',
      });
    });

    it('should render nothing if user already validated his KYC', async () => {
      mocks.kycStatus.status = 'ok';
      const { queryByTestId } = renderComponent(<KycFraudBanner />);
      expect(queryByTestId('kyc_fraud_banner')).not.toBeInTheDocument();
    });
  });
});
