import { Fragment, memo } from 'react';
import { ManagerTile } from '@ovh-ux/manager-react-components';
import { BottomSection, BottomSectionItem } from './useDashboardSections.hook';
import TileItemContent from './TileItemContent.component';

interface TileItemProps {
  item: BottomSectionItem;
  section: BottomSection;
  itemIdx: number;
  totalItems: number;
  isLoading: boolean;
  projectId: string;
}

const TileItem = memo(function TileItem({
  item,
  section,
  itemIdx,
  totalItems,
  isLoading,
  projectId,
}: TileItemProps) {
  // Simple logic for showing divider
  const shouldShowDivider = () => {
    // Don't show divider for last item
    if (itemIdx === totalItems - 1) return false;

    // Special case for billing section
    if (section.type === 'billing') {
      const currentHasPrice = !!item.price;
      const nextHasPrice = !!section.items[itemIdx + 1]?.price;

      // Show separator between vouchers (both have price)
      if (currentHasPrice && nextHasPrice) return true;

      // Show separator between last voucher and link (current has price, next doesn't)
      if (currentHasPrice && !nextHasPrice) return true;
    }

    // Default: show divider between items with labels
    const currentHasLabel = !!item.label;
    const nextHasLabel = !!section.items[itemIdx + 1]?.label;
    return currentHasLabel && nextHasLabel;
  };

  return (
    <Fragment>
      <ManagerTile.Item>
        {item.label && (
          <ManagerTile.Item.Label>{item.label}</ManagerTile.Item.Label>
        )}
        {item.description && (
          <ManagerTile.Item.Description>
            <TileItemContent
              item={item}
              section={section}
              isLoading={isLoading}
              projectId={projectId}
            />
          </ManagerTile.Item.Description>
        )}
      </ManagerTile.Item>
      {shouldShowDivider() && <ManagerTile.Divider />}
    </Fragment>
  );
});

export default TileItem;
