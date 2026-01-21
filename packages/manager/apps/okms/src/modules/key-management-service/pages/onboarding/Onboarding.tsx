import { useNavigate } from 'react-router-dom';

import { GUIDES_QUICK_START } from '@key-management-service/components/guide/guide-quick-start/guideQuickStart.constants';
import { KMS_ROUTES_URLS } from '@key-management-service/routes/routes.constants';
import { useTranslation } from 'react-i18next';

import { Text } from '@ovhcloud/ods-react';

import { ButtonType, PageLocation } from '@ovh-ux/manager-react-shell-client';
import { OnboardingLayout } from '@ovh-ux/muk';

import { useOkmsTracking } from '@/common/hooks/useOkmsTracking';
import { useGuideLink } from '@/common/utils/guides/useGuideLink';

import onboardingImgSrc from './onboarding-img.png';

export default function Onboarding() {
  const { t } = useTranslation('key-management-service/onboarding');
  const navigate = useNavigate();
  const { trackClick } = useOkmsTracking();
  const guideQuickStart = useGuideLink(GUIDES_QUICK_START);
  const descriptionsKeys = ['description', 'description_secondary'];

  return (
    <OnboardingLayout
      title={t('title')}
      img={{ src: onboardingImgSrc }}
      description={
        <div className="flex flex-col gap-3">
          {descriptionsKeys.map((descKey) => (
            <Text key={descKey} className="block text-center" preset="paragraph">
              {t(descKey)}
            </Text>
          ))}
        </div>
      }
      orderButtonLabel={t('orderButtonLabel')}
      onOrderButtonClick={() => {
        trackClick({
          location: PageLocation.page,
          buttonType: ButtonType.button,
          actionType: 'navigation',
          actions: ['create', 'okms'],
        });
        navigate(KMS_ROUTES_URLS.kmsCreate);
      }}
      moreInfoButtonLabel={t('moreInfoButtonLabel')}
      moreInfoHref={guideQuickStart}
    />
  );
}
