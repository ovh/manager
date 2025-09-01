import { useFeatureAvailability } from '@ovh-ux/manager-module-common-api';
import { useTranslation } from 'react-i18next';
import { OnboardingLayout, Breadcrumb } from '@ovh-ux/manager-react-components';
import { OdsText } from '@ovhcloud/ods-components/react';
import { KMS_FEATURES } from '@/utils/feature-availability/feature-availability.constants';
import onboardingImgSrc from './img.png';

import appConfig from '@/okms.config';

export default function Onboarding() {
  const { t } = useTranslation('onboarding');

  const title = 'Okms - Key Management Service';
  const description = `This is a placeholder application for Okms. It serves as a basis to create
    and validate the CI/CD for the new µApp called "okms" that will replace the "key-management-service" µApp .`;
  const imgSrc = {
    src: onboardingImgSrc,
  };

  const { data: features } = useFeatureAvailability([
    'okms',
    KMS_FEATURES.PRODUCT,
    KMS_FEATURES.KMS_USAGE_GUIDE,
    KMS_FEATURES.KMIP_CONNECTION_GUIDE,
    KMS_FEATURES.LOGS,
    'okms:secret-manager',
  ]);

  const featureList = features ? Object.entries(features) : [];

  return (
    <>
      <Breadcrumb rootLabel={appConfig.rootLabel} appName="okms" />
      <OnboardingLayout
        title={title}
        img={imgSrc}
        description={description}
        orderButtonLabel={t('orderButtonLabel')}
        orderHref={t('orderButtonLink')}
        moreInfoButtonLabel={t('moreInfoButtonLabel')}
        moreInfoHref={t('moreInfoButtonLink')}
      />
      <div className="w-max mx-auto mt-12">
        <OdsText preset="heading-4">Feature Flipping</OdsText>
        {featureList.map((feature) => (
          <div key={feature[0]}>
            <OdsText>
              {feature[0]}:{feature[1] ? 'true' : 'false'}
            </OdsText>
          </div>
        ))}
      </div>
    </>
  );
}
