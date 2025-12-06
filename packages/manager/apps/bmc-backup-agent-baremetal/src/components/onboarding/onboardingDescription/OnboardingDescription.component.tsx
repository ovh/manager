import React from 'react';

import { useTranslation } from 'react-i18next';

import { OdsText } from '@ovhcloud/ods-components/react';

import { useOnboardingContent } from '@/hooks/onboarding/useOnboardingData';

export const OnboardingDescription = () => {
  const { t } = useTranslation(['onboarding']);
  const { productName, productCategory, brand } = useOnboardingContent();

  return (
    <section className="text-center">
      <OdsText className="my-6 block">
        {t('onboarding:description_part1', {
          productName,
          productCategory,
          brand,
        })}
      </OdsText>
      <OdsText>{t('onboarding:description_part2', { productName })}</OdsText>
    </section>
  );
};
