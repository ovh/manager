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
      <Card
        href={
          (GUIDES_LIST.office_onboarding1_guides.url[ovhSubsidiary] ||
            GUIDES_LIST.office_onboarding1_guides.url.DEFAULT) as string
        }
        texts={{
          title: t('web_office_onboarding_guide1_title'),
          description: t('web_office_onboarding_guide1_description'),
          category: t('web_office_onboarding_tutorial'),
        }}
      />
      <Card
        href={
          (GUIDES_LIST.office_onboarding2_guides.url[ovhSubsidiary] ||
            GUIDES_LIST.office_onboarding1_guides.url.DEFAULT) as string
        }
        texts={{
          title: t('web_office_onboarding_guide2_title'),
          description: t('web_office_onboarding_guide2_description'),
          category: t('web_office_onboarding_tutorial'),
        }}
      />
      <Card
        href={
          (GUIDES_LIST.office_onboarding3_guides.url[ovhSubsidiary] ||
            GUIDES_LIST.office_onboarding1_guides.url.DEFAULT) as string
        }
        texts={{
          title: t('web_office_onboarding_guide3_title'),
          description: t('web_office_onboarding_guide3_description'),
          category: t('web_office_onboarding_tutorial'),
        }}
      />
    </OnboardingLayout>
  );
}
