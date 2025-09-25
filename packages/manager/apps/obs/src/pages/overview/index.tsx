import { useTranslation } from 'react-i18next';
import { OnboardingLayout, Breadcrumb } from '@ovh-ux/manager-react-components';

import {
  ODS_BUTTON_ICON_ALIGNMENT,
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
} from '@ovhcloud/ods-components';
import { OdsButton } from '@ovhcloud/ods-components/react';
import { useNavigate } from 'react-router-dom';
import appConfig from '@/obs.config';
import onboardingImgSrc from './onboarding-img.png';

export default function Onboarding() {
  const { t } = useTranslation('onboarding');
  const navigate = useNavigate();

  const title: string = t('title');
  const description: string = t('description');
  const imgSrc = {
    src: onboardingImgSrc,
  };

  return (
    <>
      <Breadcrumb rootLabel={appConfig.rootLabel} appName="obs" />
      <OnboardingLayout
        title={title}
        img={imgSrc}
        description={description}
        orderButtonLabel={t('orderButtonLabel')}
        orderHref="#"
        moreInfoButtonLabel={t('moreInfoButtonLabel')}
        moreInfoHref="#"
      ></OnboardingLayout>
      <div className="w-full flex justify-center gap-4 m-4">
        <OdsButton
          className="[&::part(button)]:w-full sm:w-auto"
          size={ODS_BUTTON_SIZE.md}
          variant={ODS_BUTTON_VARIANT.outline}
          onClick={() => {
            navigate('/dashboards');
          }}
          label={'Accéder aux tabeaux de bord prédéfinis'}
          iconAlignment={ODS_BUTTON_ICON_ALIGNMENT.right}
        />

        <OdsButton
          className="[&::part(button)]:w-full sm:w-auto"
          size={ODS_BUTTON_SIZE.md}
          variant={ODS_BUTTON_VARIANT.outline}
          onClick={() => {
            navigate('/settings');
          }}
          label={'Accéder aux Settings'}
          iconAlignment={ODS_BUTTON_ICON_ALIGNMENT.right}
        />
      </div>
    </>
  );
}
