import { useMemo } from 'react';

import { useTranslation } from 'react-i18next';


import { useGuideUtils } from '@ovh-ux/backup-licenses/hooks/useGuideUtils.ts';
import { useHasActiveBackupLicensesSubscription } from '@ovh-ux/backup-licenses/hooks/useHasActiveBackupLicensesSubscription';
import { urls as backupLicensesUrls } from '@ovh-ux/backup-licenses/routes/routes.constants';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Card, Links, RedirectionGuard } from '@ovh-ux/manager-react-components';
import { useNavigationGetUrl } from '@ovh-ux/manager-react-shell-client';

import { OnboardingDescription } from '@/components/onboarding/onboardingDescription/OnboardingDescription.component';
import { OnboardingLayout } from '@/components/onboarding/onboardingLayout/OnboardingLayout.component';
import { useOnboardingContent } from '@/hooks/onboarding/useOnboardingData';
import { useOnboardingHeroImage } from '@/hooks/onboarding/useOnboardingHeroImage';
import { urls } from '@/routes/Routes.constants';

export default function OnboardingPage() {
  const { t } = useTranslation(['onboarding', NAMESPACES.ACTIONS, NAMESPACES.ONBOARDING]);
  const { productName, title, tiles } = useOnboardingContent();
  const links = useGuideUtils();

  // Build hero image object with fallback alt text.
  const img = useOnboardingHeroImage();

  // Filter tiles to include only those with matching guide links.
  const validTiles = useMemo(
    () => tiles.filter(({ linkKey }) => Boolean(links[linkKey])),
    [tiles, links],
  );

  const { data: billingUrl, isPending: isBillingUrlPending } = useNavigationGetUrl([
    'dedicated',
    '#/billing/orders',
    {},
  ]);

  const { data: hasActiveSubscription, isLoading: isSubscriptionLoading } =
    useHasActiveBackupLicensesSubscription();

  return (
    <RedirectionGuard
      condition={Boolean(hasActiveSubscription)}
      isLoading={isSubscriptionLoading}
      route={backupLicensesUrls.root}
    >
      <OnboardingLayout
        title={title ?? t('onboarding:title_fallback', { productName })}
        img={img}
        description={<OnboardingDescription />}
        orderButtonLabel={t(`onboarding:save_a_baremetal_server`)}
        onOrderButtonClick={() => {}}
        moreInfoButtonLabel={t(`${NAMESPACES.ONBOARDING}:more_infos`)}
        onMoreInfoButtonClick={() => {}}
        orderHref={urls.firstOrder}
        moreInfoHref={links.website}
        isOrderDisabled={true}
        tooltipContent={t('Not implemented yet')}
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
    </RedirectionGuard>
  );
}
