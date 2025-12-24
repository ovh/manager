import React, { Suspense } from 'react';

import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ODS_ICON_NAME, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsText } from '@ovhcloud/ods-components/react';

import {
  Card,
  Links,
  OnboardingLayout,
} from '@ovh-ux/manager-react-components';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

import { urls } from '@/routes/routes.constant';
import { useGuideUtils } from '@/utils';

import onboardingImgSrc from './onboarding-img.png';
import { IpOptionTable } from './onboardingIpOptionTable';
import { OnboardingIpOptionsAdvantages } from './onboardingIpOptionsAdvantages';

export default function Onboarding() {
  const { t } = useTranslation('onboarding');
  const { guides, links } = useGuideUtils();
  const { trackClick } = useOvhTracking();
  const navigate = useNavigate();

  return (
    <OnboardingLayout
      title={t('title')}
      img={{ src: onboardingImgSrc }}
      description={
        <Suspense>
          <div className="text-center">
            <OdsText className="mb-4 block" preset={ODS_TEXT_PRESET.heading2}>
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
                  href={links?.presentationLink?.link}
                  label={t('moreInfoProductPage')}
                  onClickReturn={() => {
                    trackClick({
                      location: PageLocation.page,
                      buttonType: ButtonType.link,
                      actionType: 'action',
                      actions: [
                        `go-to_${links?.presentationLink?.trackingLabel}`,
                      ],
                    });
                  }}
                />{' '}
                {t('moreInfoOr')}{' '}
                <Links
                  href={links?.documentationLink?.link}
                  label={t('moreInfoDocPages')}
                  onClickReturn={() => {
                    trackClick({
                      location: PageLocation.page,
                      buttonType: ButtonType.link,
                      actionType: 'action',
                      actions: [
                        `go-to_${links?.documentationLink?.trackingLabel}`,
                      ],
                    });
                  }}
                />
                .
              </OdsText>
            </div>
          </div>
        </Suspense>
      }
      onOrderButtonClick={() => {
        trackClick({
          location: PageLocation.page,
          buttonType: ButtonType.button,
          actionType: 'action',
          actions: ['order_ip'],
        });
        navigate(urls.order);
      }}
      orderButtonLabel={t('orderButtonLabel')}
      moreInfoButtonLabel={t('byoipButtonLabel')}
      onMoreInfoButtonClick={() => {
        trackClick({
          location: PageLocation.page,
          buttonType: ButtonType.button,
          actionType: 'action',
          actions: ['bring-your-own_ip'],
        });
        navigate(urls.byoip);
      }}
      moreInfoButtonIcon={(null as unknown) as ODS_ICON_NAME}
    >
      {guides?.map((tile) => (
        <Card
          key={tile.href}
          {...tile}
          onClick={(e) => {
            trackClick({
              location: PageLocation.tile,
              buttonType: ButtonType.externalLink,
              actionType: 'action',
              actions: [`go-to_${tile.trackingLabel}`],
            });
            tile.onClick?.(e);
          }}
        />
      ))}
    </OnboardingLayout>
  );
}
