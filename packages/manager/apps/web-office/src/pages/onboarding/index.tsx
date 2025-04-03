import React, { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, OnboardingLayout } from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { OdsText } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import onboardingImgSrc from './onboarding-img.png';
import { GUIDES_LIST } from '@/guides.constants';

export default function Onboarding() {
  const { t } = useTranslation('onboarding');
  const context = useContext(ShellContext);
  const { ovhSubsidiary } = context.environment.getUser();

  return (
    <OnboardingLayout
      title={t('web_office_onboarding_title')}
      img={{
        src: onboardingImgSrc,
        alt: '',
      }}
      description={
        <OdsText preset={ODS_TEXT_PRESET.paragraph} className="text-center">
          {t('web_office_onboarding_description')}
        </OdsText>
      }
      orderButtonLabel={t('web_office_onboarding_order')}
      orderHref={
        GUIDES_LIST.office_cta_order.url[ovhSubsidiary] ||
        GUIDES_LIST.office_cta_order.url.DEFAULT
      }
    >
      {[1, 2, 3].map((value: number) => (
        <Card
          key={GUIDES_LIST[`office_onboarding${value}_guides`].key}
          href={
            GUIDES_LIST[`office_onboarding${value}_guides`].url[
              ovhSubsidiary
            ] || GUIDES_LIST[`office_onboarding${value}_guides`].url.DEFAULT
          }
          texts={{
            title: t(`web_office_onboarding_guide${value}_title`),
            description: t(`web_office_onboarding_guide${value}_description`),
            category: t('web_office_onboarding_tutorial'),
          }}
        />
      ))}
    </OnboardingLayout>
  );
}
