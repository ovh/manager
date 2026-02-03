import { render, screen } from '@testing-library/react';
import { beforeEach, describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import DomainResellerDashboard from './DomainResellerDashboard';

vi.mock('@/common/hooks/environment/data', () => ({
  useGetEnvironmentData: vi.fn(() => ({
    region: 'EU',
    ovhSubsidiary: 'FR',
  })),
}));

vi.mock('@/common/hooks/data/query', () => ({
  useGetServiceInformationByRoutes: vi.fn(() => ({
    serviceInfo: {
      customer: {
        contacts: [
          { type: 'administrator', customerCode: 'admin-001' },
          { type: 'technical', customerCode: 'tech-001' },
          { type: 'billing', customerCode: 'billing-001' },
        ],
      },
      billing: {
        lifecycle: {
          current: {
            creationDate: '2023-01-15T10:00:00Z',
          },
        },
        expirationDate: '2024-01-15T10:00:00Z',
        renew: {
          current: {
            mode: 'automatic',
          },
        },
      },
      resource: {
        name: 'domain-reseller-service-001',
      },
    },
    isServiceInfoLoading: false,
  })),
}));

vi.mock('@/domain-reseller/hooks/data/query', () => ({
  useGetDomainsList: vi.fn(() => ({
    data: ['domain1.com', 'domain2.com', 'domain3.com'],
    isLoading: false,
    isFetching: false,
  })),
}));

vi.mock('@ovh-ux/muk', async () => {
  const actual = await vi.importActual('@ovh-ux/muk');
  return {
    ...actual,
    useFormatDate: () => ({ date }: { date: string }) =>
      new Date(date).toLocaleDateString(),
  };
});

describe('DomainResellerDashboard', () => {
  const renderWithRouter = (component: React.ReactElement) => {
    return render(
      <MemoryRouter initialEntries={['/domain-reseller/information']}>
        {component}
      </MemoryRouter>,
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render without crashing', () => {
    const { container } = renderWithRouter(<DomainResellerDashboard />);
    expect(container).toBeInTheDocument();
  });

  it('should display the title', () => {
    renderWithRouter(<DomainResellerDashboard />);
    expect(screen.getByText('domain_reseller_title')).toBeInTheDocument();
  });
});
