import { useHref } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { Link, TEXT_PRESET, Text } from '@ovhcloud/ods-react';

import { Tile } from '@ovh-ux/muk';

import SkeletonWrapper from '@/components/dashboard/SkeletonWrapper.component';
import { SubscriptionTileProps } from '@/components/dashboard/SubscriptionTile.props';
import { getTenantSubscriptionUrl } from '@/routes/Routes.utils';

export const SubscriptionTile = ({
  tenantId,
  resourceName,
  subscriptions,
  isLoading,
}: SubscriptionTileProps) => {
  const { t } = useTranslation('tenants');

  const href = useHref(getTenantSubscriptionUrl({ tenantId, resourceName }));

  return (
    <Tile.Root title={t('dashboard.subscription_tile.title')}>
      <Tile.Item.Root>
        <Tile.Item.Term label={t('dashboard.subscription_tile.subscriptions')} />
        <Tile.Item.Description>
          <SkeletonWrapper isLoading={isLoading}>
            <Text preset={TEXT_PRESET.paragraph}>{subscriptions}</Text>
          </SkeletonWrapper>
        </Tile.Item.Description>

        <Link href={href}>{t('dashboard.subscription_tile.access_subscription_page')}</Link>
      </Tile.Item.Root>
    </Tile.Root>
  );
};

export default SubscriptionTile;
