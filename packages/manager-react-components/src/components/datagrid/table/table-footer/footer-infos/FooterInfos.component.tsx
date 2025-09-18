import { memo } from 'react';
import { Text } from '../../../../text';

const FooterInformationsComponent = ({
  totalCount,
  itemsCount,
}: {
  totalCount?: number;
  itemsCount?: number;
}) => {
  return (
    <div className="text-right h-full flex items-bottom justify-end">
      <Text>
        {itemsCount} / {totalCount}
      </Text>
    </div>
  );
};

export const FooterInfos = memo(FooterInformationsComponent);
