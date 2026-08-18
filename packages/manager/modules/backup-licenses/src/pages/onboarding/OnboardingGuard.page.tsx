import React from 'react';

import { Navigate } from 'react-router-dom';

import { RedirectionGuard } from '@ovh-ux/manager-react-components';

import { useBackupLicensesSubscriptionStatus } from '@/hooks/useBackupLicensesSubscriptionStatus/useBackupLicensesSubscriptionStatus';
import { routeUrls } from '@/routes/routes.constants';
import { SubscriptionStatus } from '@/types/Subscription.type';

import OnboardingPage from './Onboarding.page';

export default function OnboardingGuardPage() {
  const { status, isLoading } = useBackupLicensesSubscriptionStatus();

  if (status === SubscriptionStatus.PENDING || status === SubscriptionStatus.ERROR) {
    return <Navigate to={routeUrls.order} replace />;
  }

  return (
    <RedirectionGuard
      condition={status === SubscriptionStatus.READY}
      isLoading={isLoading}
      route={routeUrls.linkedServers}
    >
      <OnboardingPage />
    </RedirectionGuard>
  );
}
