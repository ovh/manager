import React, { ReactNode } from 'react';

import { useTranslation } from 'react-i18next';

import { OdsText } from '@ovhcloud/ods-components/react';

import { useOnboardingContent } from '@/hooks/onboarding/useOnboardingData';

export const OnboardingDescription = ({ message }: { message?: ReactNode }) => {
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
      {message}
    </section>
  );
};
