import { OnboardingLayout } from '@ovh-ux/manager-react-components';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsText } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { KMS_ROUTES_URLS } from '@key-management-service/routes/routes.constants';
import { GUIDES_QUICK_START } from '@key-management-service/components/guide/guide-quick-start/guideQuickStart.constants';
import onboardingImgSrc from './onboarding-img.png';
import { useGuideLink } from '@/common/utils/guides/useGuideLink';

export default function Onboarding() {
  const { t } = useTranslation('key-management-service/onboarding');
  const navigate = useNavigate();
  const { trackClick } = useOvhTracking();
  const guideQuickStart = useGuideLink(GUIDES_QUICK_START);
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
      moreInfoHref={guideQuickStart}
    />
  );
}
