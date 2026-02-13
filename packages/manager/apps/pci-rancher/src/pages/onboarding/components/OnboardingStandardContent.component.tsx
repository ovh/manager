import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card, OnboardingLayout } from '@ovh-ux/manager-react-components';
import { useNavigate, useParams } from 'react-router-dom';
import { OsdsText } from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import onboardingImgSrc from '@/assets/onboarding-img.png';
import { getCreateRancherUrl } from '@/utils/route';
import { useTrackingAction } from '@/hooks/useTrackingPage/useTrackingPage';
import { TrackingEvent, TrackingPageView } from '@/utils/tracking';
import { useGuideUtils } from '@/hooks/useGuideLink/useGuideLink';

export const OnboardingStandardContent = () => {
  const { t } = useTranslation('onboarding');
  const link = useGuideUtils();
  const navigate = useNavigate();
  const { projectId } = useParams();
  const title: string = t('title');
  const descriptionText: string = t('description');
  const trackAction = useTrackingAction();
  const onOrderButtonClick = () => {
    trackAction(TrackingPageView.Onboarding, TrackingEvent.add);
    navigate(getCreateRancherUrl(projectId ?? ''));
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

  const description = (
    <OsdsText color={ODS_THEME_COLOR_INTENT.text}>{descriptionText}</OsdsText>
  );

  return (
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
  );
};
