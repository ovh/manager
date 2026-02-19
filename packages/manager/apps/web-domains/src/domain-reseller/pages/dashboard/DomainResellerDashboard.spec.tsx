import { render, screen } from '@testing-library/react';
import { beforeEach, describe, it, expect, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import DomainResellerDashboard from './DomainResellerDashboard';
import { urls } from '@/domain-reseller/routes/routes.constants';

vi.mock('@/domain-reseller/components/Tabs/DomainResellerTabs', () => ({
  default: () => (
    <div>
      <div data-testid="serviceDetail">serviceDetail</div>
      <div data-testid="domainsList">domainsList</div>
    </div>
  ),
}));

describe('DomainResellerDashboard', () => {
  const renderWithRouter = () => {
    return render(
      <MemoryRouter
        initialEntries={[
          `${urls.domainResellerRoot}/${urls.domainResellerInformation}`,
        ]}
      >
        <Routes>
          <Route
            path={`${urls.domainResellerRoot}/*`}
            element={<DomainResellerDashboard />}
          />
        </Routes>
      </MemoryRouter>,
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render without crashing', () => {
    const { container } = renderWithRouter();
    expect(container).toBeInTheDocument();
  });

  it('should display the title', () => {
    renderWithRouter();
    expect(screen.getByText('domain_reseller_title')).toBeInTheDocument();
  });

  it('should render the tabs', () => {
    renderWithRouter();
    expect(screen.getByTestId('serviceDetail')).toBeInTheDocument();
    expect(screen.getByTestId('domainsList')).toBeInTheDocument();
  });
});
