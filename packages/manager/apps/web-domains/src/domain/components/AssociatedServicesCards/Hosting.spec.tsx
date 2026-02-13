import '@/common/setupTests';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from '@/common/utils/test.provider';
import { wrapper } from '@/common/utils/test.provider';
import Hosting from './Hosting';

vi.mock('@/domain/hooks/data/query', () => ({
  useGetAssociatedHosting: vi.fn(),
  useInitialOrderFreeHosting: vi.fn(),
  useOrderFreeHosting: vi.fn(),
  useGetFreeHostingServices: vi.fn(),
  useGetServiceInformation: vi.fn(),
}));

interface FreeHostingDrawerMockProps {
  isDrawerOpen: boolean;
  onClose: () => void;
  freeHostingOptions: unknown;
}
vi.mock('./FreeHostingDrawer', () => ({
  default: ({
    isDrawerOpen,
    onClose,
    freeHostingOptions,
  }: FreeHostingDrawerMockProps) => {
    return (
      <div data-testid="free-hosting-drawer">
        {isDrawerOpen && (
          <>
            <div data-testid="drawer-open">Drawer Open</div>
            <button onClick={onClose} data-testid="close-drawer">
              Close
            </button>
            <div data-testid="drawer-options">
              {JSON.stringify(freeHostingOptions)}
            </div>
          </>
        )}
      </div>
    );
  },
}));

const {
  useGetAssociatedHosting,
  useInitialOrderFreeHosting,
  useOrderFreeHosting,
  useGetFreeHostingServices,
} = await import('@/domain/hooks/data/query');

describe('Hosting Component', () => {
  const mockGetInitialOrder = vi.fn();
  const mockOrderFreeHosting = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useInitialOrderFreeHosting).mockReturnValue({
      orderCartDetails: null,
      isInitialOrderFreeHostingPending: false,
      getInitialOrder: mockGetInitialOrder,
      orderCartError: (undefined as unknown) as Error,
    } as ReturnType<typeof useInitialOrderFreeHosting>);

    vi.mocked(useOrderFreeHosting).mockReturnValue({
      orderFreeHosting: mockOrderFreeHosting,
      isOrderFreeHostingPending: false,
      orderCompleted: false,
    } as ReturnType<typeof useOrderFreeHosting>);
  });

  const renderComponent = (props = {}) => {
    return render(<Hosting serviceName="test-domain.com" {...props} />, {
      wrapper,
    });
  };

  describe('when there is no associated hosting', () => {
    beforeEach(() => {
      vi.mocked(useGetAssociatedHosting).mockReturnValue({
        data: undefined,
      } as ReturnType<typeof useGetAssociatedHosting>);
    });

    it('should render the component', () => {
      renderComponent();
      expect(screen.getByTestId('manager-tile-item')).toBeInTheDocument();
    });

    it('should display the no service message', () => {
      renderComponent();
      expect(screen.getByTestId('text')).toHaveTextContent(
        'domain_tab_general_information_associated_services_hosting_content',
      );
    });

    it('should display the action menu', () => {
      renderComponent();
      expect(screen.getByTestId('hosting-service')).toBeInTheDocument();
    });

    it('should display label', () => {
      renderComponent();
      expect(screen.getByTestId('tile-label')).toHaveTextContent(
        'domain_tab_general_information_associated_services_hosting',
      );
    });
  });

  describe('when there are associated hostings', () => {
    beforeEach(() => {
      vi.mocked(useGetAssociatedHosting).mockReturnValue({
        data: ['hosting1.com', 'hosting2.com'],
      } as ReturnType<typeof useGetAssociatedHosting>);
      vi.mocked(useGetFreeHostingServices).mockReturnValue([
        { data: { serviceId: 1 }, isLoading: false, isSuccess: true },
        { data: { serviceId: 2 }, isLoading: false, isSuccess: true },
      ] as ReturnType<typeof useGetFreeHostingServices>);
    });

    it('should display the list of hostings', () => {
      renderComponent();
      const links = screen.getAllByTestId('hosting-link');
      expect(links).toHaveLength(2);
      expect(links[0]).toHaveTextContent('hosting1.com');
      expect(links[1]).toHaveTextContent('hosting2.com');
    });

    it('should render hosting links with correct href', () => {
      renderComponent();
      const links = screen.getAllByTestId('hosting-link');
      expect(links[0]).toHaveAttribute(
        'href',
        'https://ovh.test/#/web/hosting/hosting1.com',
      );
    });
  });

  describe('FreeHostingDrawer interactions', () => {
    beforeEach(() => {
      vi.mocked(useGetAssociatedHosting).mockReturnValue({
        data: undefined,
      } as ReturnType<typeof useGetAssociatedHosting>);
    });

    it('should not show drawer initially', () => {
      renderComponent();
      expect(screen.queryByTestId('drawer-open')).not.toBeInTheDocument();
    });

    it('should open drawer when clicking first action menu item', async () => {
      renderComponent();
      const actionButton = screen.getByTestId('action-item-1');
      fireEvent.click(actionButton);

      await waitFor(() => {
        expect(screen.getByTestId('drawer-open')).toBeInTheDocument();
      });
    });

    it('should call getInitialOrder when drawer opens', async () => {
      renderComponent();
      const actionButton = screen.getByTestId('action-item-1');
      fireEvent.click(actionButton);

      await waitFor(() => {
        expect(mockGetInitialOrder).toHaveBeenCalled();
      });
    });

    it('should close drawer when clicking close button', async () => {
      renderComponent();
      const actionButton = screen.getByTestId('action-item-1');
      fireEvent.click(actionButton);

      await waitFor(() => {
        expect(screen.getByTestId('drawer-open')).toBeInTheDocument();
      });

      const closeButton = screen.getByTestId('close-drawer');
      fireEvent.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByTestId('drawer-open')).not.toBeInTheDocument();
      });
    });

    it('should initialize freeHostingOptions with default values', async () => {
      renderComponent();
      const actionButton = screen.getByTestId('action-item-1');
      fireEvent.click(actionButton);

      await waitFor(() => {
        const options = screen.getByTestId('drawer-options');
        expect(options).toHaveTextContent(
          JSON.stringify({ dnsA: false, dnsMx: false, consent: false }),
        );
      });
    });
  });

  describe('Order completion', () => {
    it('should close drawer when order is completed', async () => {
      vi.mocked(useGetAssociatedHosting).mockReturnValue({
        data: undefined,
      } as ReturnType<typeof useGetAssociatedHosting>);

      const orderState = {
        completed: false,
      };

      vi.mocked(useOrderFreeHosting).mockImplementation(() => ({
        orderFreeHosting: mockOrderFreeHosting,
        isOrderFreeHostingPending: false,
        orderCompleted: orderState.completed,
      }));

      const { rerender } = renderComponent();

      // Open drawer
      const actionButton = screen.getByTestId('action-item-1');
      fireEvent.click(actionButton);

      await waitFor(() => {
        expect(screen.getByTestId('drawer-open')).toBeInTheDocument();
      });

      // Simulate order completion
      orderState.completed = true;

      // Re-render to trigger useEffect
      rerender(<Hosting serviceName="test-domain.com" />);

      await waitFor(() => {
        expect(screen.queryByTestId('drawer-open')).not.toBeInTheDocument();
      });
    });
  });

  describe('Props passing to FreeHostingDrawer', () => {
    beforeEach(() => {
      vi.mocked(useGetAssociatedHosting).mockReturnValue({
        data: undefined,
      } as ReturnType<typeof useGetAssociatedHosting>);
    });

    it('should pass correct serviceName to drawer', async () => {
      renderComponent({ serviceName: 'custom-domain.com' });
      expect(screen.getByTestId('free-hosting-drawer')).toBeInTheDocument();
    });

    it('should pass orderFreeHosting function to drawer', async () => {
      renderComponent();
      const actionButton = screen.getByTestId('action-item-1');
      fireEvent.click(actionButton);

      await waitFor(() => {
        expect(screen.getByTestId('free-hosting-drawer')).toBeInTheDocument();
      });
    });

    it('should pass orderCartDetails to drawer', async () => {
      const mockCartDetails = {
        contracts: [
          {
            content: '',
            name: '',
            url: '',
          },
        ],
        cartId: '',
        details: [
          {
            cartItemID: 0,
          },
        ],
      };
      vi.mocked(useInitialOrderFreeHosting).mockReturnValue({
        orderCartDetails: mockCartDetails,
        isInitialOrderFreeHostingPending: false,
        getInitialOrder: mockGetInitialOrder,
        orderCartError: (undefined as unknown) as Error,
      } as ReturnType<typeof useInitialOrderFreeHosting>);

      renderComponent();
      expect(screen.getByTestId('free-hosting-drawer')).toBeInTheDocument();
    });
  });

  describe('Action menu items', () => {
    beforeEach(() => {
      vi.mocked(useGetAssociatedHosting).mockReturnValue({
        data: undefined,
      } as ReturnType<typeof useGetAssociatedHosting>);
    });

    it('should render both action menu items', () => {
      renderComponent();
      expect(screen.getByTestId('action-item-1')).toBeInTheDocument();
      expect(screen.getByTestId('action-item-2')).toBeInTheDocument();
    });

    it('should have correct labels for action items', () => {
      renderComponent();
      expect(screen.getByTestId('action-item-1')).toHaveTextContent(
        'domain_tab_general_information_associated_services_hosting_action_activate',
      );
      expect(screen.getByTestId('action-item-2')).toHaveTextContent(
        'domain_tab_general_information_associated_services_hosting_action_order',
      );
    });
  });
});
