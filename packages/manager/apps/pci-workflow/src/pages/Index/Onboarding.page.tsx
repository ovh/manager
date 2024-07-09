import { useEffect } from 'react';
import { PageComponent } from '@/page.component';

export const OnboardingPage = () => {
  useEffect(() => {
    console.log('effect onboarding');
  }, []);

  return (
    <PageComponent breadCrumbItems={[]} title="Onboarding page">
      Onboarding page content
    </PageComponent>
  );
};
