import React from 'react';

import { useTranslation } from 'react-i18next';

import { Text } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { OnboardingLayout } from '@ovh-ux/muk';

import { VIDEO_MANAGER_LABS_URL } from '@/constants';

import videoCenterImgSrc from './videoCenter.svg?url';

export default function VideoManagerOnboardingPage() {
  const { t } = useTranslation(['videoManagerCenter', NAMESPACES.ONBOARDING]);

  return (
    <OnboardingLayout
      title={t('video_manager_page_title')}
      img={{ src: videoCenterImgSrc, alt: '' }}
      description={<Text className="text-center">{t('video_manager_service_description')}</Text>}
      orderButtonLabel={t(`${NAMESPACES.ONBOARDING}:find_out_more`)}
      onOrderButtonClick={() => {
        window.open(VIDEO_MANAGER_LABS_URL, '_blank', 'noopener');
      }}
    ></OnboardingLayout>
  );
}
