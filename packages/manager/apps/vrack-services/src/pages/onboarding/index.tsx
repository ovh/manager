import React from 'react';
import { useTranslation } from 'react-i18next';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useNavigate, Navigate } from 'react-router-dom';
import { Card, CardProps } from '@ovhcloud/manager-components';
import {
  OrderDescription,
  useOrderPollingStatus,
} from '@ovh-ux/manager-module-order';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useGuideUtils } from '@/components/GuideLink';
import { OnboardingLayout } from '@/components/layout-helpers';
import onboardingImgSrc from '@/assets/onboarding-img.png';
import { getVrackServicesResourceListQueryKey } from '@/api';
import { urls } from '@/router/constants';
import {
  ButtonType,
  PageLocation,
  PageType,
  TrackingClickParams,
  getClickProps,
} from '@/utils/tracking';

const onboardingRefetchInterval = 30000;

const sharedClickProps: TrackingClickParams = {
  pageType: PageType.onboarding,
  location: PageLocation.page,
};

export default function OnboardingPage() {
  const { t } = useTranslation('vrack-services/onboarding');
  const link = useGuideUtils();
  const navigate = useNavigate();
  const {
    shell: {
      tracking: { trackClick },
    },
  } = React.useContext(ShellContext);
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
      onClick: () =>
        trackClick(
          getClickProps({
            ...sharedClickProps,
            buttonType: ButtonType.tutorial,
            actions: [`go-to-${t('guide1Title').replace(/\s/g, '_')}`],
          }),
        ),
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
      onClick: () =>
        trackClick(
          getClickProps({
            ...sharedClickProps,
            buttonType: ButtonType.tutorial,
            actions: [`go-to-${t('guide2Title').replace(/\s/g, '_')}`],
          }),
        ),
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
      primaryOnClick={() => {
        trackClick(
          getClickProps({
            ...sharedClickProps,
            buttonType: ButtonType.button,
            actions: ['add_vrack-services'],
          }),
        );
        navigate(urls.createVrackServices);
      }}
      secondaryButtonLabel={t('moreInfoButtonLabel')}
      secondaryHref={t('moreInfoButtonLink')}
      secondaryOnClick={() => {
        trackClick(
          getClickProps({
            ...sharedClickProps,
            buttonType: ButtonType.externalLink,
            actions: ['go-to-discover_vrack-services'],
          }),
        );
      }}
    >
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 pt-12">
        {tileList.map((tile) => (
          <Card key={tile.texts?.title} {...tile} />
        ))}
      </section>
    </OnboardingLayout>
  );
}
