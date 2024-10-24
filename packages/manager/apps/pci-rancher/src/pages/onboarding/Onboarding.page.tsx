import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  OnboardingLayout,
  PageLayout,
} from '@ovh-ux/manager-react-components';
import { useNavigate, useParams } from 'react-router-dom';
import onboardingImgSrc from '@/assets/onboarding-img.png';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb.component';
import { getCreateRancherUrl } from '@/utils/route';
import {
  useTrackingAction,
  useTrackingPage,
} from '@/hooks/useTrackingPage/useTrackingPage';
import { TrackingEvent, TrackingPageView } from '@/utils/tracking';
import { useGuideUtils } from '@/hooks/useGuideLink/useGuideLink';

export default function Onboarding() {
  const { t } = useTranslation('onboarding');
  const link = useGuideUtils();
  const navigate = useNavigate();
  const { projectId } = useParams();
  const title: string = t('title');
  const description: string = t('description');
  useTrackingPage(TrackingPageView.Onboarding);
  const trackAction = useTrackingAction();
  const onOrderButtonClick = () => {
    trackAction(TrackingPageView.Onboarding, TrackingEvent.add);
    navigate(getCreateRancherUrl(projectId));
  };

  const tileData = [
    {
      id: 1,
      titleKey: 'managedRancherServiceGettingStartedTitle',
      descriptionKey: 'managedRancherServiceGettingStartedTitleDescription',
      hrefKey: 'MANAGED_RANCHER_SERVICE_GETTING_STARTED',
    },
    {
      id: 2,
      titleKey: 'managedRancherServiceGettingStartedTitle2',
      descriptionKey: 'managedRancherServiceGettingStartedTitleDescription2',
      hrefKey: 'MANAGED_RANCHER_SERVICE_CREATION',
    },
    {
      id: 3,
      titleKey: 'managedRancherServiceGettingStartedTitle3',
      descriptionKey: 'managedRancherServiceGettingStartedTitleDescription3',
      hrefKey: 'MANAGED_RANCHER_SERVICE_LIFECYCLE_POLICY',
    },
  ];

  const tileList = tileData.map((item) => ({
    ...item,
    texts: {
      title: t(item.titleKey),
      description: t(item.descriptionKey),
      category: t('guideCategory'),
    },
    href: link?.[item.hrefKey] as string,
    isExternalHref: true,
    hoverable: true,
  }));

  return (
    <PageLayout>
      <Breadcrumb />
      <OnboardingLayout
        title={title}
        img={{ src: onboardingImgSrc }}
        description={description}
        orderButtonLabel={t('orderButtonLabel')}
        onOrderButtonClick={onOrderButtonClick}
      >
        {tileList.map((tile) => (
          <Card
            data-testid="tileCard"
            key={tile.id}
            href={tile.href}
            texts={tile.texts}
          />
        ))}
      </OnboardingLayout>
    </PageLayout>
  );
}
