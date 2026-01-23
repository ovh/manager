import React from 'react';

import { Navigate, useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { TEXT_PRESET, Text } from '@ovhcloud/ods-react';

import { useFeatureAvailability } from '@ovh-ux/manager-module-common-api';
import { OrderDescription, useOrderPollingStatus } from '@ovh-ux/manager-module-order';
import { getVrackServicesResourceListQueryKey } from '@ovh-ux/manager-network-common';
import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { BaseLayout, LinkCard, OnboardingLayout } from '@ovh-ux/muk';
import type { LinkCardProps } from '@ovh-ux/muk';

import onboardingImgSrc from '@/assets/onboarding-img.png';
import { urls } from '@/routes/RoutesAndUrl.constants';
import { TRANSLATION_NAMESPACES } from '@/utils/constants';

import { useGuideUtils } from './useGuideUtils';

const onboardingRefetchInterval = 30000;

export default function OnboardingPage() {
  const { t } = useTranslation(TRANSLATION_NAMESPACES.onboarding);
  const link = useGuideUtils();
  const navigate = useNavigate();
  const { trackClick } = useOvhTracking();
  const { data: vrackServicesDeliveringOrders } = useOrderPollingStatus({
    pollingKey: OrderDescription.vrackServices,
    queryToInvalidateOnDelivered: getVrackServicesResourceListQueryKey,
    refetchInterval: onboardingRefetchInterval,
  });
  const { data: features, isSuccess } = useFeatureAvailability(['vrack-services:order']);

  const tileList: LinkCardProps[] = [
    {
      texts: {
        title: t('guide1Title'),
        category: t('guideCategory'),
        description: t('guide1Description'),
      },
      href: link?.guideLink1 ?? '',
      onClick: () =>
        trackClick({
          location: PageLocation.page,
          buttonType: ButtonType.tutorial,
          actions: [`go-to-${t('guide1Title')}`],
        }),
      externalHref: true,
      hoverable: true,
      badges: [{ text: t('newBadgeText') }],
    },
    {
      texts: {
        title: t('guide2Title'),
        category: t('guideCategory'),
        description: t('guide2Description'),
      },
      href: link?.guideLink2 ?? '',
      onClick: () =>
        trackClick({
          location: PageLocation.page,
          buttonType: ButtonType.tutorial,
          actions: [`go-to-${t('guide2Title')}`],
        }),
      externalHref: true,
      hoverable: true,
      badges: [{ text: t('newBadgeText') }],
    },
  ];

  if (vrackServicesDeliveringOrders && vrackServicesDeliveringOrders?.length > 0) {
    return <Navigate to={urls.listing} />;
  }

  return (
    <BaseLayout>
      <Text preset={TEXT_PRESET.heading1} className="mb-6 block">
        {t('introTitle')}
      </Text>
      <Text className="mb-8 block" preset={TEXT_PRESET.paragraph}>
        {t('intro')}
      </Text>
      <OnboardingLayout
        title={t('onboardingPageTitle')}
        description={t('onboardingPageDescription')}
        img={{ src: onboardingImgSrc }}
        orderButtonLabel={
          isSuccess && features?.['vrack-services:order'] ? t('orderButtonLabel') : undefined
        }
        onOrderButtonClick={() => {
          trackClick({
            location: PageLocation.page,
            buttonType: ButtonType.button,
            actions: ['add_vrack-services'],
          });
          navigate(urls.createVrackServices);
        }}
        moreInfoButtonLabel={t('moreInfoButtonLabel')}
        moreInfoHref={link?.guideLink2}
      >
        {tileList.map((tile) => (
          <LinkCard key={tile.texts?.title} {...tile} />
        ))}
      </OnboardingLayout>
    </BaseLayout>
  );
}
