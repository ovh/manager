import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import DomainResellerDomainsList from './ServiceList';
import { useGetServiceInformationByRoutes } from '@/common/hooks/data/query';
import * as utils from '@/common/utils/utils';
import { ServiceRoutes } from '@/common/enum/common.enum';

const mockServiceInfo = {
  customer: {
    contacts: [
      { type: 'administrator', customerCode: 'admin-nic' },
      { type: 'technical', customerCode: 'tech-nic' },
      { type: 'billing', customerCode: 'billing-nic' },
    ],
  },
  billing: {
    lifecycle: {
      current: { creationDate: '2023-01-15T10:00:00Z' },
    },
    expirationDate: '2024-01-15T10:00:00Z',
  },
  resource: { name: 'domain-reseller-001' },
};

vi.mock('@/common/hooks/data/query', () => ({
  useGetServiceInformationByRoutes: vi.fn(() => ({
    serviceInfo: mockServiceInfo,
    isServiceInfoLoading: false,
  })),
}));

vi.mock('@/common/utils/utils', () => ({
  findContact: vi.fn((contacts: any[], type: string) => {
    const contact = contacts.find((c: any) => c.type === type);
    return contact?.customerCode;
  }),
}));

vi.mock('@/common/components/DomainsList/domainsList', () => ({
  default: ({
    baseRoute,
    onAssociateModalChange,
    isActionMenu,
  }: {
    baseRoute: string;
    onAssociateModalChange: (open: boolean) => void;
    isActionMenu: boolean;
  }) => (
    <div data-testid="domains-list" data-base-route={baseRoute}>
      <button
        data-testid="open-associate-modal"
        onClick={() => onAssociateModalChange(true)}
      >
        Associate
      </button>
    </div>
  ),
}));

vi.mock('@/domain-reseller/components/Modal/AssociateModal', () => ({
  default: ({
    isOpen,
    nicAdmin,
    onAssociateModalChange,
  }: {
    isOpen: boolean;
    nicAdmin: string;
    onAssociateModalChange: (open: boolean) => void;
  }) =>
    isOpen ? (
      <div data-testid="associate-modal" data-nic-admin={nicAdmin}>
        <button
          data-testid="close-associate-modal"
          onClick={() => onAssociateModalChange(false)}
        >
          Close
        </button>
      </div>
    ) : null,
}));

vi.mock('@/domain/components/Loading/Loading', () => ({
  default: () => <div data-testid="loading">Loading...</div>,
}));

describe('DomainResellerDomainsList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useGetServiceInformationByRoutes).mockReturnValue({
      serviceInfo: mockServiceInfo,
      isServiceInfoLoading: false,
    } as ReturnType<typeof useGetServiceInformationByRoutes>);
  });

  it('should render without crashing', () => {
    const { container } = render(<DomainResellerDomainsList />);
    expect(container).toBeInTheDocument();
  });

  it('should display loading state when service info is loading', () => {
    vi.mocked(useGetServiceInformationByRoutes).mockReturnValue({
      serviceInfo: null,
      isServiceInfoLoading: true,
    } as ReturnType<typeof useGetServiceInformationByRoutes>);

    render(<DomainResellerDomainsList />);
    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('should render the main container', () => {
    render(<DomainResellerDomainsList />);
    expect(
      screen.getByTestId('domain-reseller-domains-list'),
    ).toBeInTheDocument();
  });

  it('should render DomainsList component', () => {
    render(<DomainResellerDomainsList />);
    expect(screen.getByTestId('domains-list')).toBeInTheDocument();
  });

  it('should call findContact with administrator type', () => {
    render(<DomainResellerDomainsList />);
    expect(utils.findContact).toHaveBeenCalledWith(
      mockServiceInfo.customer.contacts,
      'administrator',
    );
  });

  it('should not render associate modal by default', () => {
    render(<DomainResellerDomainsList />);
    expect(screen.queryByTestId('associate-modal')).not.toBeInTheDocument();
  });

  it('should open associate modal when triggered from DomainsList', () => {
    render(<DomainResellerDomainsList />);

    fireEvent.click(screen.getByTestId('open-associate-modal'));

    expect(screen.getByTestId('associate-modal')).toBeInTheDocument();
  });

  it('should pass nicAdmin to associate modal', () => {
    render(<DomainResellerDomainsList />);

    fireEvent.click(screen.getByTestId('open-associate-modal'));

    expect(screen.getByTestId('associate-modal')).toHaveAttribute(
      'data-nic-admin',
      'admin-nic',
    );
  });

  it('should close associate modal when close is triggered', () => {
    render(<DomainResellerDomainsList />);

    fireEvent.click(screen.getByTestId('open-associate-modal'));
    expect(screen.getByTestId('associate-modal')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('close-associate-modal'));
    expect(screen.queryByTestId('associate-modal')).not.toBeInTheDocument();
  });

  it('should return undefined nicAdmin when contacts are missing', () => {
    vi.mocked(useGetServiceInformationByRoutes).mockReturnValue({
      serviceInfo: { ...mockServiceInfo, customer: {} },
      isServiceInfoLoading: false,
    } as ReturnType<typeof useGetServiceInformationByRoutes>);

    render(<DomainResellerDomainsList />);
    expect(screen.getByTestId('domains-list')).toBeInTheDocument();
  });

  it('should not render DomainsList or modal while loading', () => {
    vi.mocked(useGetServiceInformationByRoutes).mockReturnValue({
      serviceInfo: null,
      isServiceInfoLoading: true,
    } as ReturnType<typeof useGetServiceInformationByRoutes>);

    render(<DomainResellerDomainsList />);
    expect(screen.queryByTestId('domains-list')).not.toBeInTheDocument();
    expect(screen.queryByTestId('associate-modal')).not.toBeInTheDocument();
  });

  it('should not call findContact when serviceInfo is null', () => {
    vi.mocked(useGetServiceInformationByRoutes).mockReturnValue({
      serviceInfo: null,
      isServiceInfoLoading: false,
    } as ReturnType<typeof useGetServiceInformationByRoutes>);

    render(<DomainResellerDomainsList />);
    expect(utils.findContact).not.toHaveBeenCalled();
  });

  it('should toggle modal open and close multiple times', () => {
    render(<DomainResellerDomainsList />);

    // First open/close
    fireEvent.click(screen.getByTestId('open-associate-modal'));
    expect(screen.getByTestId('associate-modal')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('close-associate-modal'));
    expect(screen.queryByTestId('associate-modal')).not.toBeInTheDocument();

    // Second open/close
    fireEvent.click(screen.getByTestId('open-associate-modal'));
    expect(screen.getByTestId('associate-modal')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('close-associate-modal'));
    expect(screen.queryByTestId('associate-modal')).not.toBeInTheDocument();
  });

  it('should pass correct base route to DomainsList', () => {
    render(<DomainResellerDomainsList />);
    const domainsList = screen.getByTestId('domains-list');
    expect(domainsList).toHaveAttribute('data-base-route');
  });

  it('should call useGetServiceInformationByRoutes with DomainReseller route', () => {
    render(<DomainResellerDomainsList />);
    expect(useGetServiceInformationByRoutes).toHaveBeenCalledWith(
      ServiceRoutes.DomainReseller,
    );
  });
});
