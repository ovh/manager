import { memo } from 'react';
import { ManagerTile } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';

import { DashboardTile, DashboardItem } from '@/data/types/dashboard.type';
import BillingItem from './BillingItem.component';
import StandardItem from './StandardItem.component';

type TileItemProps = {
  item: DashboardItem;
  tile: DashboardTile;
  itemIdx: number;
  totalItems: number;
  isLoading: boolean;
};

const TileItem = memo(function TileItem({
  item,
  tile,
  itemIdx,
  totalItems,
  isLoading,
}: TileItemProps) {
  const { t } = useTranslation('home');

  // Simple logic for showing divider
  const shouldShowDivider = () => {
    // Don't show divider for last item
    if (itemIdx === totalItems - 1) return false;

    // Special case for billing tile
    if (tile.type === 'billing') {
      const currentHasPrice = !!item.price;
      const nextHasPrice = !!tile.items[itemIdx + 1]?.price;

      // Show separator between vouchers (both have price)
      if (currentHasPrice && nextHasPrice) return true;

      // Show separator between last voucher and link (current has price, next doesn't)
      if (currentHasPrice && !nextHasPrice) return true;
    }

    // Default: show divider between items with labels
    const currentHasLabel = !!item.labelTranslationKey;
    const nextHasLabel = !!tile.items[itemIdx + 1]?.labelTranslationKey;
    return currentHasLabel && nextHasLabel;
  };

  return (
    <>
      <ManagerTile.Item>
        {item.label && (
          <ManagerTile.Item.Label>{item.label}</ManagerTile.Item.Label>
        )}
        {item.labelTranslationKey && (
          <ManagerTile.Item.Label>
            {t(item.labelTranslationKey)}
          </ManagerTile.Item.Label>
        )}
        <ManagerTile.Item.Description>
          {tile.type === 'billing' && item.price ? (
            <BillingItem item={item} isLoading={isLoading} />
          ) : (
            <StandardItem {...item} />
          )}
        </ManagerTile.Item.Description>
      </ManagerTile.Item>
      {shouldShowDivider() && <ManagerTile.Divider />}
    </>
  );
});

export default TileItem;
