import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { Link, Skeleton } from '@ovhcloud/ods-react';

import { Tile } from '@ovh-ux/muk';

import { SubscriptionTileProps } from '@/components/dashboard/SubscriptionTile.props';
import { getTenantSubscriptionUrl } from '@/routes/Routes.utils';

export const SubscriptionTile = ({ tenantId, subscriptions, isLoading }: SubscriptionTileProps) => {
  const { t } = useTranslation('tenants');

  const navigate = useNavigate();

  const onClickAccessSubscriptionPageLink = () => {
    navigate(getTenantSubscriptionUrl(tenantId));
  };

  return (
    <Tile.Root title={t('dashboard.subscription_tile.title')}>
      <Tile.Item.Root>
        <Tile.Item.Term label={t('dashboard.subscription_tile.subscriptions')} />
        <Tile.Item.Description>
          {isLoading ? <Skeleton /> : <div>{subscriptions}</div>}
        </Tile.Item.Description>

        <Link onClick={onClickAccessSubscriptionPageLink}>
          <span>{t('dashboard.subscription_tile.access_subscription_page')}</span>
        </Link>
      </Tile.Item.Root>
    </Tile.Root>
  );
};

export default SubscriptionTile;
