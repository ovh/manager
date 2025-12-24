import React from 'react';

import { Trans, useTranslation } from 'react-i18next';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { useEnvironment } from '@ovh-ux/manager-react-shell-client';
import { LinkCard, OnboardingLayout } from '@ovh-ux/muk';

import { FileStorageBreadcrumb } from '@/components/breadcrumb/FileStorageBreadcrumb.component';
import { GUIDES, getOnboardingLinkFor } from '@/pages/onboarding/Onboarding.guides.constants';

export default function OnboardingPage() {
  const { t } = useTranslation(['onboarding', NAMESPACES.ACTIONS, NAMESPACES.ONBOARDING]);
  const environment = useEnvironment();

  const { ovhSubsidiary } = environment.getUser();

  return (
    <>
      <FileStorageBreadcrumb />
      <OnboardingLayout
        title={t('onboarding:title')}
        img={{
          src: 'assets/file-storage-icon.png',
          alt: '',
        }}
        description={
          <section className="text-center">
            <Trans className="block" i18nKey="onboarding:description" />
          </section>
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
    </>
  );
}
