import { ODS_CHIP_SIZE } from '@ovhcloud/ods-components';
import { OsdsChip } from '@ovhcloud/ods-components/react';

import { DataGridTextCell } from '@ovh-ux/manager-react-components';

import { RoadmapChangelogItem } from '@/types/roadmapchangelog.type';

export const RoadmapChangelogItemProductCell = ({ item }: { item: RoadmapChangelogItem }) => {
  return (
    <DataGridTextCell>
      {item.product && (
        <OsdsChip inline size={ODS_CHIP_SIZE.sm} className="whitespace-nowrap">
          {item.product}
        </OsdsChip>
      )}
    </DataGridTextCell>
  );
};
