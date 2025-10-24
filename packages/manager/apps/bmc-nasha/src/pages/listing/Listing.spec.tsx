import React, { ReactNode } from 'react';

import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

// --- Mock translation ---
vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => k }),
}));

// --- Mock router ---
const navigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => navigate,
}));

// --- Mock MUK components ---
interface BaseLayoutProps {
  header: { title: string };
  children?: ReactNode;
  breadcrumb?: ReactNode;
}

interface ButtonProps {
  variant?: string;
  children: ReactNode;
  onClick?: () => void;
}

interface MessageProps {
  type: string;
  children: ReactNode;
}

vi.mock('@ovh-ux/muk', () => ({
  BaseLayout: ({ header, children, breadcrumb }: BaseLayoutProps) => (
    <div>
      <h1>{header.title}</h1>
      <div data-testid="breadcrumb">{breadcrumb}</div>
      {children}
    </div>
  ),
  Button: ({ variant, children, onClick }: ButtonProps) => (
    <button
      data-testid="button"
      data-variant={variant}
      onClick={onClick}
    >
      {children}
    </button>
  ),
  Message: ({ type, children }: MessageProps) => (
    <div data-testid="message" data-type={type}>
      {children}
    </div>
  ),
}));

// --- Tests ---
describe('ListingPage', () => {
  afterEach(() => {
    vi.resetModules();
  });

  it('renders header and breadcrumb', async () => {
    const { default: ListingPage } = await import('./Listing.page');
    render(<ListingPage />);
    expect(screen.getByText('Nasha Services')).toBeInTheDocument();
    expect(screen.getByTestId('breadcrumb')).toBeInTheDocument();
  });

  it('renders message and button', async () => {
    const { default: ListingPage } = await import('./Listing.page');
    render(<ListingPage />);
    expect(screen.getByTestId('message')).toBeInTheDocument();
    expect(screen.getByTestId('button')).toBeInTheDocument();
    expect(screen.getByText('Get Started')).toBeInTheDocument();
  });

  it('renders welcome message', async () => {
    const { default: ListingPage } = await import('./Listing.page');
    render(<ListingPage />);
    expect(screen.getByText('Welcome to Nasha Services. This application is ready for development.')).toBeInTheDocument();
  });
});
