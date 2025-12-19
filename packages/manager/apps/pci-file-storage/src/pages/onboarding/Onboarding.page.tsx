import React, { useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { LinkCard, OnboardingLayout, Text } from '@ovh-ux/muk';

import { GUIDES } from '@/pages/onboarding/Onboarding.guides.constants';

export default function OnboardingPage() {
  const { t } = useTranslation(['onboarding', NAMESPACES.ACTIONS, NAMESPACES.ONBOARDING]);
  const productName = 'pci-file-storage';
  const productCategory = 'Public Cloud';
  const brand = 'OVHcloud';

  const description = useMemo(
    () => (
      <section className="text-center">
        <Text className="my-6 block">
          {t('onboarding:description_part1', {
            productName,
            productCategory,
            brand,
          })}
        </Text>
        <Text>{t('onboarding:description_part2', { productName })}</Text>
      </section>
    ),
    [t],
  );

  return (
    <OnboardingLayout
      title={t('onboarding:title_fallback', { productName })}
      img={undefined}
      description={description}
      orderButtonLabel={t(`${NAMESPACES.ACTIONS}:start`)}
      onOrderButtonClick={() => {}}
      moreInfoButtonLabel={t(`${NAMESPACES.ONBOARDING}:more_infos`)}
    >
      {GUIDES.map(({ key, link }) => {
        return (
          <LinkCard
            key={key}
            href={link}
            texts={{
              title: t(`onboarding:guides.${key}.title`, { productName }),
              description: t(`onboarding:guides.${key}.description`, {
                productName,
              }),
              category: t(`onboarding:guides.${key}.category`),
            }}
            hrefLabel={t(`onboarding:guides.${key}.cta`)}
          />
        );
      })}
    </OnboardingLayout>
  );
}
