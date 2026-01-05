import React from 'react';

import { useTranslation } from 'react-i18next';

import { Text } from '@ovhcloud/ods-react';

import { OnboardingLayout } from '@ovh-ux/muk';

import onboardingImgSrc from './onboarding.svg?url';

export default function VideoManagerOnboardingPage() {
  const { t } = useTranslation('videoManagerCenter');

  return (
    <OnboardingLayout
      title={t('video_manager_page_title')}
      img={{ src: onboardingImgSrc, alt: '' }}
      description={
        <Text className="text-center">
          Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
          laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi
          architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit
          aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione
          voluptatem sequi nesciunt.{' '}
        </Text>
      }
      orderButtonLabel={t('video_manager_service_download_first_video')}
      onOrderButtonClick={() => {
        window.open('', '_blank', 'noopener');
      }}
    ></OnboardingLayout>
  );
}
