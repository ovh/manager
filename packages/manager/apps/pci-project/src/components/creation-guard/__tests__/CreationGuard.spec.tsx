import React from 'react';

import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import useCreationRedirect from '@/hooks/use-creation-redirect/useCreationRedirect';
import { urls } from '@/routes/routes.constant';
import { createWrapper } from '@/wrapperRenders';

import CreationGuard from '../CreationGuard';

// Mock the hook
vi.mock('@/hooks/use-creation-redirect/useCreationRedirect', () => ({
  default: vi.fn(),
}));

// Mock the RedirectionGuard component
vi.mock('@ovh-ux/manager-react-components', () => ({
  RedirectionGuard: ({
    condition,
    route,
    isLoading,
    children,
  }: {
    condition: boolean;
    route: string;
    isLoading: boolean;
    children: React.ReactNode;
  }) => {
    if (isLoading) {
      return <div data-testid="loading">Loading...</div>;
    }
    if (condition) {
      return <div data-testid="redirect" data-route={route} />;
    }
    return <>{children}</>;
  },
}));

// Mock the lazy-loaded CreationPage
vi.mock('@/pages/creation/Creation.page', () => ({
  default: () => <div data-testid="creation-page">Creation Page</div>,
}));

const mockUseCreationRedirect = vi.mocked(useCreationRedirect);

describe('CreationGuard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should show loading state when hook is loading', () => {
    mockUseCreationRedirect.mockReturnValue({
      shouldRedirectToIncreaseQuota: false,
      shouldBlockCreation: false,
      redirectRoute: `../${urls.increaseQuota}`,
      isLoading: true,
    });

    render(<CreationGuard />, { wrapper: createWrapper() });

    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  it('should render creation page when no redirection is needed', async () => {
    mockUseCreationRedirect.mockReturnValue({
      shouldRedirectToIncreaseQuota: false,
      shouldBlockCreation: false,
      redirectRoute: `../${urls.increaseQuota}`,
      isLoading: false,
    });

    render(<CreationGuard />, { wrapper: createWrapper() });

    await waitFor(() => {
      expect(screen.getByTestId('creation-page')).toBeInTheDocument();
    });
  });

  it('should redirect to increase quota when user needs to increase quota', () => {
    mockUseCreationRedirect.mockReturnValue({
      shouldRedirectToIncreaseQuota: true,
      shouldBlockCreation: true,
      redirectRoute: `../${urls.increaseQuota}`,
      isLoading: false,
    });

    render(<CreationGuard />, { wrapper: createWrapper() });

    const redirect = screen.getByTestId('redirect');
    expect(redirect).toHaveAttribute('data-route', `../${urls.increaseQuota}`);
  });

  it('should redirect to discovery project activation when discovery project exists', () => {
    const discoveryProjectId = 'discovery-project-123';
    mockUseCreationRedirect.mockReturnValue({
      shouldRedirectToIncreaseQuota: false,
      shouldBlockCreation: true,
      redirectRoute: `../${discoveryProjectId}?activateDiscovery=1`,
      isLoading: false,
    });

    render(<CreationGuard />, { wrapper: createWrapper() });

    const redirect = screen.getByTestId('redirect');
    expect(redirect).toHaveAttribute('data-route', `../${discoveryProjectId}?activateDiscovery=1`);
  });
});
