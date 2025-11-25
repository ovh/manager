import React from 'react';

import { render } from '@testing-library/react';
import type { Mock } from 'vitest';

import { AppConfig } from '@/App.constants';
import { useBreadcrumb } from '@/hooks/layout/useBreadcrumb';

import Breadcrumb from './Breadcrumb.component';

// Mock ODS components to avoid CSS import issues
vi.mock('@ovhcloud/ods-react', () => ({
  Breadcrumb: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="ods-breadcrumb">{children}</div>
  ),
  BreadcrumbItem: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="breadcrumb-item">{children}</div>
  ),
  BreadcrumbLink: ({ href, children }: { href: string; children: React.ReactNode }) => (
    <a href={href} data-testid="breadcrumb-link">
      {children}
    </a>
  ),
}));

// Mock the useBreadcrumb hook
vi.mock('@/hooks/layout/useBreadcrumb', () => ({
  useBreadcrumb: vi.fn(),
}));

describe('Breadcrumb', () => {
  it('renders breadcrumb items from hook', () => {
    (useBreadcrumb as Mock).mockReturnValue([
      { label: 'Home', href: '/' },
      { label: 'Dashboard', href: '/dashboard' },
    ]);

    const { getByText, getAllByTestId } = render(<Breadcrumb items={[]} />);

    expect(getByText('Home')).toBeInTheDocument();
    expect(getByText('Dashboard')).toBeInTheDocument();
    expect(getAllByTestId('breadcrumb-item')).toHaveLength(2);
  });

  it('uses customRootLabel if provided', () => {
    (useBreadcrumb as Mock).mockReturnValue([{ label: 'CustomRoot', href: '/' }]);

    const { getByText } = render(<Breadcrumb items={[]} customRootLabel="CustomRoot" />);

    expect(getByText('CustomRoot')).toBeInTheDocument();
  });

  it('falls back to AppConfig.rootLabel if no customRootLabel', () => {
    (useBreadcrumb as Mock).mockReturnValue([{ label: AppConfig.rootLabel, href: '/' }]);

    const { getByText } = render(<Breadcrumb items={[]} />);

    expect(getByText(AppConfig.rootLabel)).toBeInTheDocument();
  });
});
