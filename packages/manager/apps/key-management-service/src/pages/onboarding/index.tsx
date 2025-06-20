import { OnboardingLayout } from '@ovh-ux/manager-react-components';
import React from 'react';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsText } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import useGuideUtils from '@/hooks/guide/useGuideUtils';
import { KMS_ROUTES_URLS } from '@/routes/routes.constants';
import onboardingImgSrc from './onboarding-img.png';

export default function Onboarding() {
  const { t } = useTranslation('key-management-service/onboarding');
  const navigate = useNavigate();
  const guideLinks = useGuideUtils();
  const { trackClick } = useOvhTracking();
  const descriptionsKeys = ['description', 'description_secondary'];

  return (
    <OnboardingLayout
      title={t('title')}
      img={{ src: onboardingImgSrc }}
      description={
        <div className="flex flex-col gap-3">
          {descriptionsKeys.map((descKey) => (
            <OdsText
              key={descKey}
              className="block text-center"
              preset={ODS_TEXT_PRESET.paragraph}
            >
              {t(descKey)}
            </OdsText>
          ))}
        </div>
      }
      orderButtonLabel={t('orderButtonLabel')}
      onOrderButtonClick={() => {
        trackClick({
          location: PageLocation.page,
          buttonType: ButtonType.button,
          actionType: 'navigation',
          actions: ['create_kms'],
        });
        navigate(KMS_ROUTES_URLS.kmsCreate);
      }}
      moreInfoButtonLabel={t('moreInfoButtonLabel')}
      moreInfoHref={guideLinks?.quickStart}
    />
  );
}
