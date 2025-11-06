import { useTranslation } from 'react-i18next';

import { Tile } from '@ovh-ux/muk';

import type { ServiceInfo } from '@/types/Dashboard.type';

type BillingTileProps = {
  serviceInfo: ServiceInfo;
  servicePath: string;
  withEngagement: boolean;
  shouldReengage: boolean;
};

export function BillingTile({
  serviceInfo,
  servicePath,
  withEngagement,
  shouldReengage,
}: BillingTileProps) {
  const { t } = useTranslation('dashboard');

  // Format dates
  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <Tile.Root title={t('billing.title')}>
      {serviceInfo.creation && (
        <Tile.Item.Root>
          <Tile.Item.Term label={t('billing.creation')} />
          <Tile.Item.Description label={formatDate(serviceInfo.creation)} />
        </Tile.Item.Root>
      )}

      {serviceInfo.expiration && (
        <Tile.Item.Root>
          <Tile.Item.Term label={t('billing.expiration')} />
          <Tile.Item.Description label={formatDate(serviceInfo.expiration)} />
        </Tile.Item.Root>
      )}

      {serviceInfo.status && (
        <Tile.Item.Root>
          <Tile.Item.Term label={t('billing.status')} />
          <Tile.Item.Description label={serviceInfo.status} />
        </Tile.Item.Root>
      )}

      {withEngagement && serviceInfo.engagedUpTo && (
        <Tile.Item.Root>
          <Tile.Item.Term label={t('billing.engagement')} />
          <Tile.Item.Description label={formatDate(serviceInfo.engagedUpTo)} />
        </Tile.Item.Root>
      )}
    </Tile.Root>
  );
}

