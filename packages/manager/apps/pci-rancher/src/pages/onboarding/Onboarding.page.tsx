import React from 'react';
import { PageLayout } from '@ovh-ux/manager-react-components';
import useRancherEligibility from '@/data/hooks/useRancherEligibility/useRancherEligibility';
import { useTrackingPage } from '@/hooks/useTrackingPage/useTrackingPage';
import { TrackingPageView } from '@/utils/tracking';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb.component';
import { OnboardingFreeTrialContent } from './components/OnboardingFreeTrialContent.component';
import { OnboardingStandardContent } from './components/OnboardingStandardContent.component';

export default function Onboarding() {
  const { data: eligibility } = useRancherEligibility();
  useTrackingPage(TrackingPageView.Onboarding);

  const isFreeTrialAvailable = eligibility?.data?.freeTrial;

  return (
    <PageLayout>
      <Breadcrumb />
      {isFreeTrialAvailable ? (
        <OnboardingFreeTrialContent />
      ) : (
        <OnboardingStandardContent />
      )}
    </PageLayout>
  );
}
