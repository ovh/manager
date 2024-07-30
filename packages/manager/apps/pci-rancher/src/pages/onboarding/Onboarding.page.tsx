import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  OnboardingLayout,
  PageLayout,
} from '@ovhcloud/manager-components';
import { useNavigate, useParams } from 'react-router-dom';
import onboardingImgSrc from '../../assets/onboarding-img.png';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb.component';
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

  const tileList = [
    {
      id: 1,
      texts: {
        title: t('managedRancherServiceGettingStartedTitle'),
        description: t('managedRancherServiceGettingStartedTitleDescription'),
        category: t('guideCategory'),
      },
      href: link?.MANAGED_RANCHER_SERVICE_GETTING_STARTED as string,

      isExternalHref: true,
      hoverable: true,
    },
  ];

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
