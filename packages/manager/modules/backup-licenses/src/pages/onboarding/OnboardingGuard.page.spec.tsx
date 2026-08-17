import React from 'react';

import { Route, Routes } from 'react-router-dom';

import { screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useHasActiveBackupLicensesSubscription } from '@/hooks/useHasActiveBackupLicensesSubscription/useHasActiveBackupLicensesSubscription';
import { routeUrls } from '@/routes/routes.constants';
import { renderWithProviders } from '@/test-utils/renderWithProviders';

import OnboardingGuardPage from './OnboardingGuard.page';

vi.mock('@/hooks/useHasActiveBackupLicensesSubscription/useHasActiveBackupLicensesSubscription');

const mockedUseHasActiveBackupLicensesSubscription = vi.mocked(
  useHasActiveBackupLicensesSubscription,
);

const renderGuard = () =>
  renderWithProviders(
    <Routes>
      <Route path="/" element={<OnboardingGuardPage />} />
      <Route path={routeUrls.linkedServers} element={<div>linked-servers-page</div>} />
    </Routes>,
  );

describe('OnboardingGuardPage', () => {
  it('shows a spinner while the subscription check is loading', async () => {
    mockedUseHasActiveBackupLicensesSubscription.mockReturnValue({
      data: undefined,
      isLoading: true,
    } as ReturnType<typeof useHasActiveBackupLicensesSubscription>);

    await renderGuard();

    expect(screen.queryByText('Backup Licences')).not.toBeInTheDocument();
  });

  it('renders the onboarding page when there is no active subscription', async () => {
    mockedUseHasActiveBackupLicensesSubscription.mockReturnValue({
      data: false,
      isLoading: false,
    } as ReturnType<typeof useHasActiveBackupLicensesSubscription>);

    await renderGuard();

    expect(screen.getByText('Backup Licences')).toBeInTheDocument();
  });

  it('redirects to the linked servers page when a subscription is active', async () => {
    mockedUseHasActiveBackupLicensesSubscription.mockReturnValue({
      data: true,
      isLoading: false,
    } as ReturnType<typeof useHasActiveBackupLicensesSubscription>);

    await renderGuard();

    await waitFor(() => expect(screen.getByText('linked-servers-page')).toBeInTheDocument());
  });
});
