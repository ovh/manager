import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from './DisableMFA.page';

const mockedUsedNavigate = vi.fn();
const mockedUsedLocation = vi.fn();

const fetch2faStatusFakeResponse = {
  data: { status: 'open' },
  isFetched: false,
  isLoading: false,
  isSuccess: false,
  error: {},
};

vi.mock('react-router-dom', () => ({
  useNavigate: () => mockedUsedNavigate,
  useLocation: () => mockedUsedLocation,
  Outlet: () => <p>TestOutlet</p>,
}));

vi.mock('@/context/User/modals/SessionModals', () => ({
  SessionModals: () => <div>SessionModals</div>,
}));

vi.mock('@/components/Loading/Loading', () => ({
  default: () => <p>TestLoading</p>,
}));

vi.mock('@/data/hooks/useStatus', () => ({
  useFetch2faStatus: () => fetch2faStatusFakeResponse,
}));

describe('DisableMFA.page', () => {
  it('should navigate to see page when status is open', async () => {
    fetch2faStatusFakeResponse.isFetched = true;
    fetch2faStatusFakeResponse.isSuccess = true;
    fetch2faStatusFakeResponse.error = undefined;

    render(<Home />);

    expect(mockedUsedNavigate).toHaveBeenCalledWith(
      '/account-disable-2fa/see',
      { replace: true },
    );
  });

  it('should navigate to create page when status is creationAuthorized', async () => {
    fetch2faStatusFakeResponse.data = null;
    fetch2faStatusFakeResponse.isSuccess = false;
    fetch2faStatusFakeResponse.error = {
      response: {
        status: 404,
        data: {
          class: 'Client::ErrNotFound::ErrNotFound',
        },
      },
    };

    render(<Home />);

    expect(mockedUsedNavigate).toHaveBeenCalledWith(
      '/account-disable-2fa/create',
      {
        replace: true,
      },
    );
  });

  it('should navigate to error page when api respond a non 404 error', async () => {
    fetch2faStatusFakeResponse.error = {
      response: {
        status: 400,
      },
    };

    render(<Home />);

    expect(mockedUsedNavigate).toHaveBeenCalledWith(
      '/account-disable-2fa/error',
      {
        replace: true,
      },
    );
  });

  it('should render outlet component when isFetched is true', async () => {
    fetch2faStatusFakeResponse.isSuccess = true;
    fetch2faStatusFakeResponse.error = undefined;

    render(<Home />);

    const outletElements = screen.getAllByText((content, element) => {
      return element.textContent.includes('TestOutlet');
    });
    expect(outletElements.length).to.be.at.least(1);
  });
});
