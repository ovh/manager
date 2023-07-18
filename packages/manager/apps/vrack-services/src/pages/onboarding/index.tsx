import React from 'react';
import { useTranslation } from 'react-i18next';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useNavigate, Navigate } from 'react-router-dom';
import { Card, CardProps } from '@ovhcloud/manager-components';
import {
  OrderDescription,
  useOrderPollingStatus,
} from '@ovh-ux/manager-module-order';
import { useGuideUtils } from '@/components/GuideLink';
import { OnboardingLayout } from '@/components/layout-helpers';
import onboardingImgSrc from '@/assets/onboarding-img.png';
import { getVrackServicesResourceListQueryKey } from '@/api';
import { urls } from '@/router/constants';

const onboardingRefetchInterval = 30000;

const OnboardingPage = () => {
  const { t } = useTranslation('vrack-services/onboarding');
  const link = useGuideUtils();
  const navigate = useNavigate();
  const { data: vrackServicesDeliveringOrders } = useOrderPollingStatus({
    pollingKey: OrderDescription.vrackServices,
    queryToInvalidateOnDelivered: getVrackServicesResourceListQueryKey,
    refetchInterval: onboardingRefetchInterval,
  });

  const tileList: CardProps[] = [
    {
      texts: {
        title: t('guide1Title'),
        category: t('guideCategory'),
        description: t('guide1Description'),
      },
      href: link?.guideLink1 as string,
      trackingLabel: `vrack-services::onboarding::docs::${t('guide1Title')}`,
      isExternalHref: true,
      hoverable: true,
      badges: [
        { text: t('newBadgeText'), color: ODS_THEME_COLOR_INTENT.primary },
      ],
    },
    {
      texts: {
        title: t('guide2Title'),
        category: t('guideCategory'),
        description: t('guide2Description'),
      },
      href: link?.guideLink2 as string,
      trackingLabel: `vrack-services::onboarding::docs::${t('guide2Title')}`,
      isExternalHref: true,
      hoverable: true,
      badges: [
        { text: t('newBadgeText'), color: ODS_THEME_COLOR_INTENT.primary },
      ],
    },
  ];

  if (vrackServicesDeliveringOrders?.length > 0) {
    return <Navigate to={urls.listing} />;
  }

  return (
    <OnboardingLayout
      introTitle={t('introTitle')}
      intro={t('intro')}
      title={t('title')}
      description={t('description')}
      imageSrc={onboardingImgSrc}
      primaryButtonLabel={t('orderButtonLabel')}
      primaryOnClick={() => navigate(urls.createVrackServices)}
      primaryButtonDataTracking="vrack-services::onboarding::add"
      secondaryButtonLabel={t('moreInfoButtonLabel')}
      secondaryHref={t('moreInfoButtonLink')}
      secondaryButtonDataTracking="vrack-services::onboarding::discover"
    >
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 pt-12">
        {tileList.map((tile) => (
          <Card key={tile.texts?.title} {...tile} />
        ))}
      </section>
    </OnboardingLayout>
  );
};

export default OnboardingPage;
