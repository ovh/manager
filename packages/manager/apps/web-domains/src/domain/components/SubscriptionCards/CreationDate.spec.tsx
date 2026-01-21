import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import CreationDate from './CreationDate';
import { TDomainResource } from '@/domain/types/domainResource';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

vi.mock('@ovh-ux/manager-react-components', () => {
  const MockManagerTileItem = ({ children }: { children: React.ReactNode }) => (
    <div data-testid="tile-item">{children}</div>
  );
  MockManagerTileItem.Label = ({ children }: { children: React.ReactNode }) => (
    <div data-testid="tile-label">{children}</div>
  );

  return {
    ManagerTile: {
      Item: MockManagerTileItem,
    },
    useFormatDate: () => (options: { date: string }) => options.date,
  };
});

const queryClient = new QueryClient();

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
);

describe('CreationDate', () => {
  const mockDomainResources: TDomainResource = {
    currentState: {
      createdAt: '2023-01-15T10:30:00Z',
    },
  } as TDomainResource;

  it('should render creation date label', () => {
    render(<CreationDate domainResources={mockDomainResources} />, { wrapper });

    expect(
      screen.getByText(
        '@ovh-ux/manager-common-translations/dashboard:creation_date',
      ),
    ).toBeInTheDocument();
  });

  it('should render formatted creation date', () => {
    render(<CreationDate domainResources={mockDomainResources} />, { wrapper });

    expect(screen.getByText('2023-01-15T10:30:00Z')).toBeInTheDocument();
  });

  it('should display the creation date from domainResources', () => {
    const customDomainResources: TDomainResource = {
      currentState: {
        createdAt: '2024-06-20T14:45:00Z',
      },
    } as TDomainResource;

    render(<CreationDate domainResources={customDomainResources} />, {
      wrapper,
    });

    expect(screen.getByText('2024-06-20T14:45:00Z')).toBeInTheDocument();
  });
});
