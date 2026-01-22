import { useContext } from 'react';

import { useTranslation } from 'react-i18next';

import { TEXT_PRESET, Text } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useFeatureAvailability } from '@ovh-ux/manager-module-common-api';
import {
  ButtonType,
  PageLocation,
  ShellContext,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { LinkCard, OnboardingLayout } from '@ovh-ux/muk';

import { GUIDES_LIST } from '@/Guides.constants';
import { GO_TO, ORDER_OFFICE } from '@/Tracking.constants';

import onboardingImgSrc from './onboarding-img.png';

export default function Onboarding() {
  const { t } = useTranslation(['onboarding', NAMESPACES.ACTIONS, NAMESPACES.ONBOARDING]);
  const { trackClick } = useOvhTracking();
  const context = useContext(ShellContext);
  const { ovhSubsidiary } = context.environment.getUser();
  const { data: availability } = useFeatureAvailability(['web-office:order']);

  return (
    <OnboardingLayout
      title={t('web_office_onboarding_title')}
      img={{
        src: onboardingImgSrc,
        alt: '',
      }}
      description={
        <Text preset={TEXT_PRESET.paragraph} className="text-center">
          {t('web_office_onboarding_description')}
        </Text>
      }
      orderButtonLabel={t(`${NAMESPACES.ACTIONS}:order`)}
      onOrderButtonClick={
        availability?.['web-office:order']
          ? () => {
              trackClick({
                location: PageLocation.page,
                buttonType: ButtonType.button,
                actionType: 'action',
                actions: [ORDER_OFFICE],
              });

              window.open(
                GUIDES_LIST.office_cta_order.url[ovhSubsidiary] ||
                  GUIDES_LIST.office_cta_order.url.DEFAULT,
                '_blank',
                'noopener',
              );
            }
          : null
      }
    >
      {[1, 2, 3].map((value: number) => (
        <LinkCard
          key={GUIDES_LIST[`office_onboarding${value}_guides`].key}
          href={
            GUIDES_LIST[`office_onboarding${value}_guides`].url[ovhSubsidiary] ||
            GUIDES_LIST[`office_onboarding${value}_guides`].url.DEFAULT
          }
          texts={{
            title: t(`web_office_onboarding_guide${value}_title`),
            description: t(`web_office_onboarding_guide${value}_description`),
            category: t(`${NAMESPACES.ONBOARDING}:tutorial`),
          }}
          externalHref={true}
          onClick={() => {
            trackClick({
              location: PageLocation.tile,
              buttonType: ButtonType.link,
              actionType: 'navigation',
              actions: [GO_TO(GUIDES_LIST[`office_onboarding${value}_guides`].tracking)],
            });
          }}
        />
      ))}
    </OnboardingLayout>
  );
}
