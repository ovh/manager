import { Suspense } from 'react';

import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { Card, Text, Link, TEXT_PRESET } from '@ovhcloud/ods-react';

import { OnboardingLayout } from '@ovh-ux/muk';
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
            <Text className="mb-4 block" preset={TEXT_PRESET.heading2}>
              {t('titleBis')}
            </Text>
            <Text className="block">{t('description')}</Text>

            <div className="mt-8">
              <OnboardingIpOptionsAdvantages />

              <IpOptionTable />

              <div className="mt-4 text-left">
                <Text preset={TEXT_PRESET.span}>* {t('optionsFootnote')}</Text>
                <Text preset={TEXT_PRESET.span}>** {t('geolocationNote')}</Text>
              </div>

              <Text className="mt-4 text-left">
                {t('moreInfoText')}{' '}
                <Link
                  href={links?.presentationLink?.link}
                  onClick={() => {
                    trackClick({
                      location: PageLocation.page,
                      buttonType: ButtonType.link,
                      actionType: 'action',
                      actions: [
                        `go-to_${links?.presentationLink?.trackingLabel}`,
                      ],
                    });
                  }}
                >
                  {t('moreInfoProductPage')}
                </Link>{' '}
                {t('moreInfoOr')}{' '}
                <Link
                  href={links?.documentationLink?.link}
                  onClick={() => {
                    trackClick({
                      location: PageLocation.page,
                      buttonType: ButtonType.link,
                      actionType: 'action',
                      actions: [
                        `go-to_${links?.documentationLink?.trackingLabel}`,
                      ],
                    });
                  }}
                >
                  {t('moreInfoDocPages')}
                </Link>
                .
              </Text>
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
      moreInfoHref={urls.byoip}
      // onMoreInfoButtonClick={() => {
      //   trackClick({
      //     location: PageLocation.page,
      //     buttonType: ButtonType.button,
      //     actionType: 'action',
      //     actions: ['bring-your-own_ip'],
      //   });
      //   navigate(urls.byoip);
      // }}
      moreInfoButtonIcon={null}
    >
      {guides?.map((tile) => (
        <Card
          key={tile.href}
          {...tile}
          onClick={() => {
            trackClick({
              location: PageLocation.tile,
              buttonType: ButtonType.externalLink,
              actionType: 'action',
              actions: [`go-to_${tile.trackingLabel}`],
            });
          }}
        />
      ))}
    </OnboardingLayout>
  );
}
