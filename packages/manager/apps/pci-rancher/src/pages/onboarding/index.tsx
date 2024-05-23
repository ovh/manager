import React from 'react';
import { OnboardingLayout } from '@ovhcloud/manager-components';
import { useNavigate, useParams } from 'react-router-dom';
import onboardingImgSrc from '../../assets/onboarding-img.png';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import PageLayout from '@/components/PageLayout/PageLayout';
import { getCreateRancherUrl } from '@/utils/route';
import { useTrackingAction, useTrackingPage } from '@/hooks/useTrackingPage';
import { TrackingEvent, TrackingPageView } from '@/utils/tracking';
import { useTranslate } from '@/utils/translation';

export default function Onboarding() {
  const { t } = useTranslate('pci-rancher/onboarding');
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

  return (
    <PageLayout>
      <Breadcrumb />
      <OnboardingLayout
        title={title}
        img={{ src: onboardingImgSrc, width: 450, height: 250 }}
        description={description}
        orderButtonLabel={t('orderButtonLabel')}
        onOrderButtonClick={onOrderButtonClick}
      />
    </PageLayout>
  );
}
