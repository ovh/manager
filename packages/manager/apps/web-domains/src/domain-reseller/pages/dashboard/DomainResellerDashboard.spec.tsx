import { render, screen } from '@testing-library/react';
import { beforeEach, describe, it, expect, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import DomainResellerDashboard from './DomainResellerDashboard';

vi.mock('@ovh-ux/muk', async () => {
  const actual = await vi.importActual('@ovh-ux/muk');
  return {
    ...actual,
  };
});

describe('DomainResellerDashboard', () => {
  const renderWithRouter = () => {
    return render(
      <MemoryRouter initialEntries={['/domain-reseller/information']}>
        <Routes>
          <Route
            path="/domain-reseller/:serviceName/*"
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
