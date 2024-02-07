import React from 'react';
import { useTranslation } from 'react-i18next';
import { OnboardingLayout } from '@ovhcloud/manager-components';
import { useNavigate, useParams } from 'react-router-dom';
import onboardingImgSrc from '../../assets/onboarding-img.png';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import PageLayout from '@/components/PageLayout/PageLayout';

export default function Onboarding() {
  const { t } = useTranslation('pci-rancher/onboarding');
  const navigate = useNavigate();
  const { projectId } = useParams();
  const title: string = t('title');
  const description: string = t('description');

  const onOrderButtonClick = () =>
    navigate(`/pci/projects/${projectId}/rancher/new`);

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
