import { OnboardingLayout } from '@ovhcloud/manager-components';
import React from 'react';
import {
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
  ODS_TEXT_COLOR_INTENT,
} from '@ovhcloud/ods-components';
import { OsdsText } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import useGuideUtils from '@/hooks/guide/useGuideUtils';
import { ROUTES_URLS } from '@/routes/routes.constants';
import onboardingImgSrc from './onboarding-img.png';

export default function Onboarding() {
  const { t } = useTranslation('key-management-service/onboarding');
  const navigate = useNavigate();
  const guideLinks = useGuideUtils();
  const descriptionsKeys = ['description', 'description_secondary'];

  return (
    <OnboardingLayout
      title={t('title')}
      img={{ src: onboardingImgSrc }}
      description={descriptionsKeys.map((descKey) => (
        <OsdsText
          level={ODS_TEXT_LEVEL.body}
          size={ODS_TEXT_SIZE._800}
          color={ODS_TEXT_COLOR_INTENT.text}
          className="block text-center mb-4"
          key={descKey}
        >
          {t(descKey)}
        </OsdsText>
      ))}
      orderButtonLabel={t('orderButtonLabel')}
      onOrderButtonClick={() =>
        navigate(`/${ROUTES_URLS.createKeyManagementService}`)
      }
      moreInfoButtonLabel={t('moreInfoButtonLabel')}
      moreInfoHref={guideLinks?.quickStart}
    ></OnboardingLayout>
  );
}
