import { useTranslation } from 'react-i18next';
import { OnboardingLayout, Breadcrumb } from '@ovh-ux/manager-react-components';
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
    </>
  );
}
