import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  OnboardingLayout,
  PageLayout,
} from '@ovh-ux/manager-react-components';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ButtonType,
  PageLocation,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import onboardingImgSrc from '@/assets/onboarding-img.png';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb.component';
import { getCreateRancherUrl } from '@/utils/route';
import { TrackingEvent, TrackingPageView } from '@/utils/tracking';
import { useGuideUtils } from '@/hooks/useGuideLink/useGuideLink';

export default function Onboarding() {
  const { trackClick } = useOvhTracking();
  const { t } = useTranslation('onboarding');
  const link = useGuideUtils();
  const navigate = useNavigate();
  const { projectId } = useParams();
  const title: string = t('title');
  const description: string = t('description');
  const onOrderButtonClick = () => {
    trackClick({
      location: PageLocation.page,
      buttonType: ButtonType.link,
      actionType: 'navigation',
      actions: [TrackingPageView.Onboarding, TrackingEvent.add],
    });
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
