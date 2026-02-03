import { useMemo } from 'react';

import { useSearchParams } from 'react-router-dom';

import { useQuery } from '@tanstack/react-query';
import { Trans, useTranslation } from 'react-i18next';

import { OdsMessage } from '@ovhcloud/ods-components/react';

import { useBaremetalsList } from '@ovh-ux/backup-agent/data/hooks/baremetal/useBaremetalsList';
import { useBackupVaultsListOptions } from '@ovh-ux/backup-agent/data/hooks/vaults/getVault';
import { useGuideUtils } from '@ovh-ux/backup-agent/hooks/useGuideUtils.ts';
import { urls as backupAgentUrls } from '@ovh-ux/backup-agent/routes/routes.constants';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Card, Links, RedirectionGuard } from '@ovh-ux/manager-react-components';
import { useNavigationGetUrl } from '@ovh-ux/manager-react-shell-client';

import { OnboardingDescription } from '@/components/onboarding/onboardingDescription/OnboardingDescription.component';
import { OnboardingLayout } from '@/components/onboarding/onboardingLayout/OnboardingLayout.component';
import { useOnboardingContent } from '@/hooks/onboarding/useOnboardingData';
import { useOnboardingHeroImage } from '@/hooks/onboarding/useOnboardingHeroImage';
import { urls } from '@/routes/Routes.constants';

export default function OnboardingPage() {
  const [searchParams] = useSearchParams();
  const { t } = useTranslation(['onboarding', NAMESPACES.ACTIONS, NAMESPACES.ONBOARDING]);
  const { productName, title, tiles } = useOnboardingContent();
  const links = useGuideUtils();
  const { flattenData, isPending } = useBaremetalsList({ pageSize: 1 });
  const isOrderSuccess = searchParams.get('orderSuccess') === 'true';
  const {
    data: isBackupAgentReady,
    isPending: isVaultPending,
    isSuccess: isVaultSuccess,
    isError: isVaultError,
  } = useQuery({
    ...useBackupVaultsListOptions(),
    retry: false,
    select: (vaults) =>
      vaults.filter(({ currentState: { status } }) => status === 'READY').length >= 1,
  });

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

  const orderInProgressMessage =
    isVaultSuccess || isOrderSuccess ? (
      <OdsMessage color="success">
        <Trans
          ns="onboarding"
          i18nKey="baremetal_label_order_in_progress"
          values={{ href: (billingUrl as string) ?? '#' }}
          components={{
            OrderLink: (
              <Links
                className="px-2"
                href={(billingUrl as string) ?? '#'}
                isDisabled={isBillingUrlPending}
              />
            ),
          }}
        />
      </OdsMessage>
    ) : null;

  return (
    <RedirectionGuard
      condition={!!isBackupAgentReady}
      isLoading={isVaultPending}
      route={backupAgentUrls.dashboardTenant}
    >
      <OnboardingLayout
        title={title ?? t('onboarding:title_fallback', { productName })}
        img={img}
        description={<OnboardingDescription message={orderInProgressMessage} />}
        orderButtonLabel={t(`onboarding:save_a_baremetal_server`)}
        onOrderButtonClick={() => {}}
        moreInfoButtonLabel={t(`${NAMESPACES.ONBOARDING}:more_infos`)}
        onMoreInfoButtonClick={() => {}}
        isOrderLoading={isPending}
        orderHref={urls.firstOrder}
        moreInfoHref={links.website}
        isOrderDisabled={!flattenData?.length || !isVaultError || isVaultPending || isOrderSuccess}
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
    </RedirectionGuard>
  );
}
