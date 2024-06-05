import React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from './Home.page';

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

vi.mock('@/components/Loading/Loading', () => ({
  default: () => <p>TestLoading</p>,
}));

vi.mock('@/data/hooks/useStatus', () => ({
  useFetch2faStatus: () => fetch2faStatusFakeResponse,
}));

describe('Home.page', () => {
  it('should navigate to see page when status is open', async () => {
    fetch2faStatusFakeResponse.data.status = 'open';
    fetch2faStatusFakeResponse.isLoading = false;
    fetch2faStatusFakeResponse.isFetched = true;
    fetch2faStatusFakeResponse.isSuccess = true;
    fetch2faStatusFakeResponse.error = undefined;

    render(<Home />);

    expect(mockedUsedNavigate).toHaveBeenCalledWith('/see', { replace: true });
  });

  it('should navigate to create page when status is creationAuthorized', async () => {
    fetch2faStatusFakeResponse.isFetched = true;
    fetch2faStatusFakeResponse.error = {
      response: {
        status: 404,
        data: {
          class: 'Client::ErrNotFound::ErrNotFound',
        },
      },
    };

    render(<Home />);

    expect(mockedUsedNavigate).toHaveBeenCalledWith('/create', {
      replace: true,
    });
  });

  it('should render outlet component when isFetched is true', async () => {
    fetch2faStatusFakeResponse.isLoading = false;
    fetch2faStatusFakeResponse.isFetched = true;
    fetch2faStatusFakeResponse.isSuccess = true;
    fetch2faStatusFakeResponse.error = undefined;

    render(<Home />);

    const outletElements = screen.getAllByText((content, element) => {
      return element.textContent.includes('TestOutlet');
    });
    expect(outletElements.length).to.be.at.least(1);
  });
});
