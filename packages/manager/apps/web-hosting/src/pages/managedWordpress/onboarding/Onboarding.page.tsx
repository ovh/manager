import React from 'react';

import { useTranslation } from 'react-i18next';

import { Text } from '@ovhcloud/ods-react';

import { OnboardingLayout } from '@ovh-ux/muk';

import { MANAGED_WORDPRESS_URL } from '@/constants';

import managedWordpressImgSrc from './managedWordpress.png';

export default function ManagedWordpressOnboardingPage() {
  const { t } = useTranslation('managedWordpress');

  return (
    <OnboardingLayout
      title={t('web_hosting_managed_wordpress_title')}
      img={{ src: managedWordpressImgSrc, alt: '' }}
      description={
        <Text className="text-center">{t('web_hosting_managed_wordpress_description')}</Text>
      }
      orderButtonLabel={t('web_hosting_managed_wordpress_discover')}
      onOrderButtonClick={() => {
        window.open(MANAGED_WORDPRESS_URL, '_blank', 'noopener');
      }}
    ></OnboardingLayout>
  );
}
