import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  OnboardingLayout,
  Links,
} from '@ovh-ux/manager-react-components';
import { OdsText } from '@ovhcloud/ods-components/react';
import { ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { useGuideUtils } from '@/utils';
import onboardingImgSrc from './onboarding-img.png';
import { urls } from '@/routes/routes.constant';
import { OnboardingIpOptionsAdvantages } from './onboardingIpOptionsAdvantages';
import { IpOptionTable } from './onboardingIpOptionTable';

export default function Onboarding() {
  const { t } = useTranslation('onboarding');
  const { guides, links } = useGuideUtils();
  const navigate = useNavigate();

  return (
    <OnboardingLayout
      title={t('title')}
      img={{ src: onboardingImgSrc }}
      description={
        <div className="text-center">
          <OdsText className="block mb-4" preset={ODS_TEXT_PRESET.heading2}>
            {t('titleBis')}
          </OdsText>
          <OdsText className="block">{t('description')}</OdsText>

          <div className="mt-8">
            <OnboardingIpOptionsAdvantages />

            <IpOptionTable />

            <div className="mt-4 text-left">
              <OdsText preset={ODS_TEXT_PRESET.span}>
                * {t('optionsFootnote')}
              </OdsText>
              <OdsText preset={ODS_TEXT_PRESET.span}>
                ** {t('geolocationNote')}
              </OdsText>
            </div>

            <OdsText className="mt-4 text-left">
              {t('moreInfoText')}{' '}
              <Links
                href={links?.presentationLink}
                label={t('moreInfoProductPage')}
              />{' '}
              {t('moreInfoOr')}{' '}
              <Links
                href={links?.documentationLink}
                label={t('moreInfoDocPages')}
              />
              .
            </OdsText>
          </div>
        </div>
      }
      onOrderButtonClick={() => navigate(urls.order)}
      orderButtonLabel={t('orderButtonLabel')}
      moreInfoButtonLabel={t('byoipButtonLabel')}
      onmoreInfoButtonClick={() => navigate(urls.byoip)}
    >
      {guides?.map((tile) => (
        <Card key={tile.href} {...tile} />
      ))}
    </OnboardingLayout>
  );
}
