import React from 'react';

import { Route, Routes } from 'react-router-dom';

import { screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useBackupLicensesSubscriptionStatus } from '@/hooks/useBackupLicensesSubscriptionStatus/useBackupLicensesSubscriptionStatus';
import { routeUrls } from '@/routes/routes.constants';
import { renderWithProviders } from '@/test-utils/renderWithProviders';
import { SubscriptionStatus } from '@/types/Subscription.type';

import OnboardingGuardPage from './OnboardingGuard.page';

vi.mock('@/hooks/useBackupLicensesSubscriptionStatus/useBackupLicensesSubscriptionStatus');

const mockedUseSubscriptionStatus = vi.mocked(useBackupLicensesSubscriptionStatus);

const mockStatus = (status: SubscriptionStatus, isLoading = false) =>
  mockedUseSubscriptionStatus.mockReturnValue({
    status,
    isLoading,
    isError: false,
    pendingOrder: null,
    clearPendingOrder: vi.fn(),
  });

const renderGuard = () =>
  renderWithProviders(
    <Routes>
      <Route path="/" element={<OnboardingGuardPage />} />
      <Route path={routeUrls.linkedServers} element={<div>linked-servers-page</div>} />
      <Route path={routeUrls.order} element={<div>order-page</div>} />
    </Routes>,
  );

describe('OnboardingGuardPage', () => {
  it('shows a spinner while the subscription check is loading', async () => {
    mockStatus(SubscriptionStatus.NONE, true);

    await renderGuard();

    expect(screen.queryByText('Backup Licenses')).not.toBeInTheDocument();
  });

  it('renders the onboarding page when there is no subscription and no order in flight', async () => {
    mockStatus(SubscriptionStatus.NONE);

    await renderGuard();

    expect(screen.getByText('Backup Licenses')).toBeInTheDocument();
  });

  it('redirects to the linked servers page when the subscription is ready', async () => {
    mockStatus(SubscriptionStatus.READY);

    await renderGuard();

    await waitFor(() => expect(screen.getByText('linked-servers-page')).toBeInTheDocument());
  });

  it('redirects to the order tunnel while an order is being delivered', async () => {
    mockStatus(SubscriptionStatus.PENDING);

    await renderGuard();

    await waitFor(() => expect(screen.getByText('order-page')).toBeInTheDocument());
  });

  it('redirects to the order tunnel when the delivery failed, so the failure can be told', async () => {
    mockStatus(SubscriptionStatus.ERROR);

    await renderGuard();

    await waitFor(() => expect(screen.getByText('order-page')).toBeInTheDocument());
  });

  it('does not wait for the API when a local order trace already answers the question', async () => {
    mockStatus(SubscriptionStatus.PENDING, true);

    await renderGuard();

    await waitFor(() => expect(screen.getByText('order-page')).toBeInTheDocument());
  });
});
