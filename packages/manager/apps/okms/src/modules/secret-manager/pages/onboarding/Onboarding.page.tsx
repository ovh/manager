import { useNavigate } from 'react-router-dom';

import { GuideKv2Card } from '@secret-manager/components/guides/guide-kv2-api/GuideKv2Card.component';
import { GuideManagerCard } from '@secret-manager/components/guides/guide-manager/GuideManagerCard.component';
import { GuideRestApiCard } from '@secret-manager/components/guides/guide-rest-api/GuideRestApiCard.component';
import { SECRET_MANAGER_ROUTES_URLS } from '@secret-manager/routes/routes.constants';
import { useTranslation } from 'react-i18next';

import { OdsText } from '@ovhcloud/ods-components/react';

import { OnboardingLayout } from '@ovh-ux/manager-react-components';
import { ButtonType, PageLocation } from '@ovh-ux/manager-react-shell-client';

import { useOkmsTracking } from '@/common/hooks/useOkmsTracking';

import onboardingImage from './onboarding.png';

export default function SecretManagerOnboardingPage() {
  const { t } = useTranslation('secret-manager');
  const navigate = useNavigate();
  const { trackClick } = useOkmsTracking();

  return (
    <OnboardingLayout
      title={t('secret_manager')}
      img={{ src: onboardingImage }}
      description={
        <div className="flex flex-col gap-2">
          <OdsText className="text-center">{t('onboarding_description_1')}</OdsText>
          <OdsText className="text-center">{t('onboarding_description_2')}</OdsText>
        </div>
      }
      orderButtonLabel={t('create_a_secret')}
      onOrderButtonClick={() => {
        trackClick({
          location: PageLocation.page,
          buttonType: ButtonType.button,
          actionType: 'navigation',
          actions: ['create', 'secret'],
        });
        navigate(SECRET_MANAGER_ROUTES_URLS.createSecret);
      }}
    >
      <GuideManagerCard />
      <GuideRestApiCard />
      <GuideKv2Card />
    </OnboardingLayout>
  );
}
