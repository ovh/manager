import '@/common/setupTests';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@/common/utils/test.provider';
import { wrapper } from '@/common/utils/test.provider';
import Hosting from './Hosting';
import { FREE_HOSTING_PLAN_CODE } from '@/common/constants/order';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('@/domain/hooks/data/query', () => ({
  useGetAssociatedHosting: vi.fn(),
  useGetFreeHostingServices: vi.fn(),
}));

vi.mock('@ovh-ux/manager-react-components', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@ovh-ux/manager-react-components')>();
  const React = await import('react');

  const Label = ({ children }: { children?: React.ReactNode }) =>
    React.createElement('dt', { 'data-testid': 'tile-label' }, children);

  const Item = Object.assign(
    ({ children }: { children?: React.ReactNode }) =>
      React.createElement('div', { 'data-testid': 'manager-tile-item' }, children),
    { Label },
  );

  return {
    ...actual,
    useResourcesIcebergV6: vi.fn(),
    useResourcesIcebergV2: vi.fn(),
    useAuthorizationIam: vi.fn(),
    useFeatureAvailability: vi.fn((features: string[]) => ({
      data: Object.fromEntries(
        (features ?? []).map((feature) => [feature, true]),
      ),
    })),
    ManagerTile: { Item },
    ActionMenu: ({ id, items }: { id: string; items: Array<{ id: number; label: string; onClick: () => void }> }) =>
      React.createElement('div', { 'data-testid': id }, items?.map((item) =>
        React.createElement('button', { key: item.id, 'data-testid': `action-item-${item.id}`, onClick: item.onClick }, item.label),
      )),
  };
});

vi.mock('@ovhcloud/ods-react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@ovhcloud/ods-react')>();
  const React = await import('react');
  return {
    ...actual,
    Text: ({ children, ...props }: { children?: React.ReactNode;[key: string]: unknown }) =>
      React.createElement('span', { 'data-testid': 'text', ...props }, children),
    Link: ({ href, children, ...props }: { href?: string; children?: React.ReactNode;[key: string]: unknown }) =>
      React.createElement('a', { href, 'data-testid': 'hosting-link', ...props }, children),
    Skeleton: () => React.createElement('div', { 'data-testid': 'skeleton' }),
  };
});

const {
  useGetAssociatedHosting,
  useGetFreeHostingServices,
} = await import('@/domain/hooks/data/query');

describe('Hosting Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default: no free hosting service resolved.
    vi.mocked(useGetFreeHostingServices).mockReturnValue(
      [] as ReturnType<typeof useGetFreeHostingServices>,
    );
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

  describe('Free hosting activation (configo route)', () => {
    beforeEach(() => {
      vi.mocked(useGetAssociatedHosting).mockReturnValue({
        data: undefined,
      } as ReturnType<typeof useGetAssociatedHosting>);
    });

    it('should navigate to the free hosting configo route when clicking activate', () => {
      renderComponent();
      fireEvent.click(screen.getByTestId('action-item-1'));

      // Push (not replace) so the configo's history.back() returns here.
      expect(mockNavigate).toHaveBeenCalledWith(
        '/domain/test-domain.com/free-hosting/order',
      );
    });

    it('should not render the activate action when a free hosting is already active', () => {
      vi.mocked(useGetAssociatedHosting).mockReturnValue({
        data: ['hosting1.com'],
      } as ReturnType<typeof useGetAssociatedHosting>);
      vi.mocked(useGetFreeHostingServices).mockReturnValue([
        {
          data: { billing: { plan: { code: FREE_HOSTING_PLAN_CODE } } },
          isLoading: false,
          isSuccess: true,
        },
      ] as ReturnType<typeof useGetFreeHostingServices>);

      renderComponent();
      expect(screen.queryByTestId('action-item-1')).not.toBeInTheDocument();
      // The paid "order" action stays available.
      expect(screen.getByTestId('action-item-2')).toBeInTheDocument();
    });
  });

  describe('Paid hosting order', () => {
    beforeEach(() => {
      vi.mocked(useGetAssociatedHosting).mockReturnValue({
        data: undefined,
      } as ReturnType<typeof useGetAssociatedHosting>);
    });

    it('should navigate to the web hosting order route when clicking order', () => {
      renderComponent();
      fireEvent.click(screen.getByTestId('action-item-2'));

      expect(mockNavigate).toHaveBeenCalledWith(
        '/domain/test-domain.com/webhosting/order',
        { replace: true },
      );
    });
  });
});
