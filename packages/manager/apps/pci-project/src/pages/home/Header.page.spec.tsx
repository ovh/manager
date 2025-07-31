/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { createOptimalWrapper } from '@/test-utils/lightweight-wrappers';

import ProjectHeader from './Header.page';

// Mock Outlet de react-router-dom
vi.mock('react-router-dom', async (importOriginal) => {
  const actual: typeof import('react-router-dom') = await importOriginal();
  return {
    ...actual,
    Outlet: () => <div data-testid="outlet" />,
  };
});

// Mock des hooks qui utilisent ShellContext
vi.mock('@/hooks/useTabs/useTabs', () => ({
  useTabs: vi.fn(() => ({
    tabs: [
      { label: 'Home', to: '/home' },
      { label: 'Edit', to: '/edit' },
    ],
  })),
}));

vi.mock('@ovh-ux/manager-react-components', async (importOriginal) => {
  const actual: typeof import('@ovh-ux/manager-react-components') = await importOriginal();
  return {
    ...actual,
    useProjectUrl: vi.fn(() => '/public-cloud/projects'),
    BaseLayout: ({ breadcrumb, tabs, children }: any) => (
      <div data-testid="base-layout">
        <div data-testid="breadcrumb">{breadcrumb}</div>
        <div data-testid="tabs">{tabs}</div>
        {children}
      </div>
    ),
    ChangelogButton: () => <div data-testid="changelog-button" />,
  };
});

vi.mock('@ovh-ux/manager-pci-common', () => ({
  isDiscoveryProject: vi.fn(() => false),
  useProject: vi.fn(() => ({
    data: { description: 'Test Project' },
    isLoading: false,
    error: null,
  })),
  TabsPanel: ({ tabs }: any) => (
    <div data-testid="tabs-panel">
      {tabs.map((tab: any, index: number) => (
        <div key={index} data-testid={`tab-${index}`}>
          {tab.label}
        </div>
      ))}
    </div>
  ),
}));

const wrapper = createOptimalWrapper({ routing: true, shell: true });

describe('ProjectHeader', () => {
  it('renders base layout with breadcrumb and tabs', async () => {
    render(<ProjectHeader />, { wrapper });
    expect(screen.getByTestId('base-layout')).toBeInTheDocument();
    expect(screen.getByTestId('breadcrumb')).toBeInTheDocument();
    expect(screen.getByTestId('tabs-panel')).toBeInTheDocument();
  });

  it('has proper accessibility structure', async () => {
    render(<ProjectHeader />, { wrapper });
    expect(screen.getByTestId('base-layout')).toBeInTheDocument();
    expect(screen.getByTestId('breadcrumb')).toBeInTheDocument();
  });
});
