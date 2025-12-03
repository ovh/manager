/* eslint-disable @typescript-eslint/no-explicit-any */
import { BrowserRouter } from 'react-router-dom';

import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import OrderPage from './Order.page';

// Mock dependencies
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, fallback?: string) => fallback || key,
  }),
}));

vi.mock('@ovh-ux/manager-react-shell-client', () => ({
  useOvhTracking: () => ({
    trackClick: vi.fn(),
  }),
  PageLocation: { page: 'page' },
  ButtonType: { button: 'button', externalLink: 'externalLink' },
}));

vi.mock('@ovh-ux/muk', () => ({
  BaseLayout: ({ children, header }: any) => (
    <div data-testid="base-layout">
      <div data-testid="header">{header.title}</div>
      {children}
    </div>
  ),
}));

vi.mock('@module-federation/runtime', () => ({
  init: vi.fn(),
  loadRemote: vi.fn(),
}));

describe('OrderPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading state initially', () => {
    render(
      <BrowserRouter>
        <OrderPage />
      </BrowserRouter>,
    );

    expect(screen.getByTestId('base-layout')).toBeInTheDocument();
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('should render header with title', () => {
    render(
      <BrowserRouter>
        <OrderPage />
      </BrowserRouter>,
    );

    expect(screen.getByTestId('header')).toHaveTextContent('Order');
  });

  it('should attempt to load Module Federation component', async () => {
    const { init, loadRemote } = await import('@module-federation/runtime');

    render(
      <BrowserRouter>
        <OrderPage />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(init).toHaveBeenCalledWith({
        remotes: [
          {
            name: '@order/ConfigoNasHa',
            alias: 'order_fm',
            type: 'module',
            entry: 'https://www.ovhcloud.com/order/configos/assets/remoteEntry.js',
          },
        ],
      });
      expect(loadRemote).toHaveBeenCalledWith('order_fm/ConfigoNasHa');
    });
  });

  it('should render error state when component loading fails', async () => {
    const { loadRemote } = await import('@module-federation/runtime');
    (loadRemote as any).mockRejectedValueOnce(new Error('Load failed'));

    render(
      <BrowserRouter>
        <OrderPage />
      </BrowserRouter>,
    );

    await waitFor(() => {
      expect(screen.getByText(/error loading order component/i)).toBeInTheDocument();
      expect(screen.getByText(/back to listing/i)).toBeInTheDocument();
    });
  });
});
