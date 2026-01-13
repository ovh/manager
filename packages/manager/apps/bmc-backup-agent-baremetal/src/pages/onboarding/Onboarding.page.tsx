import React, { useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import { useBaremetalsList } from '@ovh-ux/backup-agent/data/hooks/baremetal/useBaremetalsList';
import { useGuideUtils } from '@ovh-ux/backup-agent/hooks/useGuideUtils.ts';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Card } from '@ovh-ux/manager-react-components';

import { OnboardingDescription } from '@/components/onboarding/onboardingDescription/OnboardingDescription.component';
import { OnboardingLayout } from '@/components/onboarding/onboardingLayout/OnboardingLayout.component';
import { useOnboardingContent } from '@/hooks/onboarding/useOnboardingData';
import { useOnboardingHeroImage } from '@/hooks/onboarding/useOnboardingHeroImage';
import { urls } from '@/routes/Routes.constants';

export default function OnboardingPage() {
  const { t } = useTranslation(['onboarding', NAMESPACES.ACTIONS, NAMESPACES.ONBOARDING]);
  const { productName, title, tiles } = useOnboardingContent();
  const links = useGuideUtils();
  const { flattenData, isLoading } = useBaremetalsList({ pageSize: 1 });

  // Build hero image object with fallback alt text.
  const img = useOnboardingHeroImage();

  // Filter tiles to include only those with matching guide links.
  const validTiles = useMemo(
    () => tiles.filter(({ linkKey }) => Boolean(links[linkKey])),
    [tiles, links],
  );

  return (
    <OnboardingLayout
      title={title ?? t('onboarding:title_fallback', { productName })}
      img={img}
      description={<OnboardingDescription />}
      orderButtonLabel={t(`onboarding:save_a_baremetal_server`)}
      onOrderButtonClick={() => {}}
      moreInfoButtonLabel={t(`${NAMESPACES.ONBOARDING}:more_infos`)}
      onMoreInfoButtonClick={() => {}}
      isOrderLoading={isLoading}
      orderHref={urls.firstOrder}
      moreInfoHref={links.main}
      isOrderDisabled={!flattenData?.length}
      tooltipContent={!flattenData?.length ? t('no_baremetal_available') : undefined}
    >
      {validTiles.map(({ id, key, linkKey }) => {
        const href = links[linkKey];
        if (!href) return null;

        return (
          <Card
            key={id}
            href={href}
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
