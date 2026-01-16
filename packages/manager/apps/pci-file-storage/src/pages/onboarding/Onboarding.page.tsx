import React from 'react';

import { Trans, useTranslation } from 'react-i18next';

import { Text } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useEnvironment } from '@ovh-ux/manager-react-shell-client';
import { BaseLayout, LinkCard, OnboardingLayout } from '@ovh-ux/muk';

import { Breadcrumb } from '@/components/breadcrumb/Breadcrumb.component';
import { GUIDES, getOnboardingLinkFor } from '@/pages/onboarding/Onboarding.guides.constants';

export default function OnboardingPage() {
  const { t } = useTranslation(['onboarding', NAMESPACES.ACTIONS, NAMESPACES.ONBOARDING]);
  const environment = useEnvironment();

  const { ovhSubsidiary } = environment.getUser();

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
        onOrderButtonClick={() => {}}
        orderHref="https://labs.ovhcloud.com/en/file-storage"
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
