import React from 'react';

import { useNavigate } from 'react-router-dom';

import { Trans, useTranslation } from 'react-i18next';

import { Text } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { BaseLayout, LinkCard, OnboardingLayout } from '@ovh-ux/muk';

import { Breadcrumb } from '@/components/breadcrumb/Breadcrumb.component';
import { GUIDES, getOnboardingLinkFor } from '@/constants/Guides.constants';
import { useGetUser } from '@/hooks/useGetUser';
import { subRoutes } from '@/routes/Routes.constants';

export default function OnboardingPage() {
  const { t } = useTranslation(['onboarding', NAMESPACES.ACTIONS, NAMESPACES.ONBOARDING]);
  const { ovhSubsidiary } = useGetUser();
  const navigate = useNavigate();

  return (
    <BaseLayout>
      <Breadcrumb />
      <OnboardingLayout
        title={t('onboarding:title')}
        img={{
          src: 'assets/file-storage-icon.png',
          alt: '',
          className: 'w-[45px]',
        }}
        description={
          <Text className="text-center">
            <Trans className="block" i18nKey="onboarding:description" />
          </Text>
        }
        orderButtonLabel={t('onboarding:action-button')}
        onOrderButtonClick={() => navigate(`../${subRoutes.create}`)}
      >
        {GUIDES.map(({ key, links }) => {
          return (
            <LinkCard
              key={key}
              href={getOnboardingLinkFor(links, ovhSubsidiary)}
              texts={{
                title: t(`onboarding:guides.${key}.title`),
                description: t(`onboarding:guides.${key}.description`),
                category: t(`onboarding:guides.${key}.category`),
              }}
              hrefLabel={t(`onboarding:guides.${key}.link-text`)}
              target="_blank"
            />
          );
        })}
      </OnboardingLayout>
    </BaseLayout>
  );
}
