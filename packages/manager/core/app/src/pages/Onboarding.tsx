import React from 'react';
import { useTranslation } from 'react-i18next';
import Onboarding, { Guide } from '../components/Onboarding';

export default function OnboardingPage(): JSX.Element {
  const { t } = useTranslation('onboarding');
  const guides: Guide[] = [
    {
      title: 'Guide 1',
      link: 'https://docs.ovh.com/1',
    },
    {
      title: 'Guide 2',
      link: 'https://docs.ovh.com/2',
      category: t('Improvement'),
    },
  ];
  return (
    <Onboarding
      title={t('nutanix')}
      description={t('Nutanix lorem ipsum')}
      cta="https://ovh.com/nutanix"
      guides={guides}
    />
  );
}
