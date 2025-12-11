import React from 'react';

import { Outlet } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { OnboardingDescription } from '@/components/onboarding/onboardingDescription/OnboardingDescription.component';
import { OnboardingLayout } from '@/components/onboarding/onboardingLayout/OnboardingLayout.component';
import { useOnboardingContent } from '@/hooks/onboarding/useOnboardingData';
import { useOnboardingHeroImage } from '@/hooks/onboarding/useOnboardingHeroImage';

import { FirstOrderFormComponent } from './_components/first-order-form/FirstOrderForm.component';

export default function FirstOrderPage() {
  const { t } = useTranslation([
    'onboarding',
    NAMESPACES.ACTIONS,
    NAMESPACES.ONBOARDING,
    NAMESPACES.FORM,
  ]);
  const { productName, title } = useOnboardingContent();

  const img = useOnboardingHeroImage();
  // Build localized description paragraph.
  return (
    <>
      <section className="flex flex-col items-center justify-center gap-10">
        <OnboardingLayout
          title={title ?? t('onboarding:title_fallback', { productName })}
          img={img}
          description={<OnboardingDescription />}
        ></OnboardingLayout>
        <FirstOrderFormComponent />
      </section>
      <Outlet />
    </>
  );
}
