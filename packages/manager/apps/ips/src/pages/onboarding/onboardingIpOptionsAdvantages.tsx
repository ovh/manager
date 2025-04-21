import React from 'react';
import { OdsText } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';

export function OnboardingIpOptions() {
  const { t } = useTranslation('onboarding');
  const ADVANTAGES = [
    {
      title: t('advantage1Title'),
      description: t('advantage1Description'),
    },
    {
      title: t('advantage2Title'),
      description: t('advantage2Description'),
    },
    {
      title: t('advantage3Title'),
      description: t('advantage3Description'),
    },
    {
      title: t('advantage4Title'),
      description: t('advantage4Description'),
    },
  ];

  return (
    <div>
      {ADVANTAGES.map((advantage) => (
        <li key={advantage.title}>
          <OdsText preset={ODS_TEXT_PRESET.heading5}>
            {advantage.title}:
          </OdsText>
          <OdsText>{advantage.description}</OdsText>
        </li>
      ))}
    </div>
  );
}

export default OnboardingIpOptions;
