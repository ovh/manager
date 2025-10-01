import { FunctionComponent } from 'react';

import { ODS_CHIP_SIZE } from '@ovhcloud/ods-components';
import { OsdsChip } from '@ovhcloud/ods-components/react';

import { DataGridTextCell } from '@ovh-ux/manager-react-components';

import { RoadmapChangelogItem } from '@/types/roadmapchangelog.type';

import { ROADMAP_STATUS_COLORS } from './roadmapChangelogItemStatusCell.constants';

type Props = {
  item: RoadmapChangelogItem;
};
export const RoadmapChangelogItemStatusCell: FunctionComponent<Props> = ({ item }) => {
  return (
    <DataGridTextCell>
      <OsdsChip
        inline
        size={ODS_CHIP_SIZE.sm}
        color={ROADMAP_STATUS_COLORS[item.status]}
        className="whitespace-nowrap"
      >
        {item.status}
      </OsdsChip>
    </DataGridTextCell>
  );
};
