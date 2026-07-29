import React from 'react';

import { Navigate } from 'react-router-dom';

import { OdsSpinner } from '@ovhcloud/ods-components/react';

import { useHasActiveBackupLicensesSubscription } from '@/hooks/useHasActiveBackupLicensesSubscription/useHasActiveBackupLicensesSubscription';
import { stubRoutes } from '@/routes/routes.constants';

import OnboardingPage from './Onboarding.page';

export default function OnboardingGuardPage() {
  const { data: hasActiveSubscription, isLoading } = useHasActiveBackupLicensesSubscription();

  if (isLoading) {
    return (
      <div className="flex justify-center pt-10">
        <OdsSpinner />
      </div>
    );
  }

  if (hasActiveSubscription) {
    return <Navigate to={stubRoutes.dashboard} replace />;
  }

  return <OnboardingPage />;
}
