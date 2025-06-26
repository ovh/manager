import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import {
  ODS_THEME_COLOR_HUE,
  ODS_THEME_COLOR_INTENTS,
} from '@ovhcloud/ods-common-theming';
import { ODS_CHIP_SIZE, ODS_TEXT_COLOR_INTENT } from '@ovhcloud/ods-components';
import { OsdsChip } from '@ovhcloud/ods-components/react';

export const RoadmapChangelogItemProductCell = ({ item }: { item: any }) => {
  return (
    <DataGridTextCell>
      <OsdsChip inline size={ODS_CHIP_SIZE.sm} className="whitespace-nowrap">
        {item.product}
      </OsdsChip>
    </DataGridTextCell>
  );
};

export const RoadmapChangelogItemTitleCell = ({ item }: { item: any }) => {
  return <DataGridTextCell>{item.title}</DataGridTextCell>;
};

export const RoadmapChangelogItemDescriptionCell = ({
  item,
}: {
  item: any;
}) => {
  return <DataGridTextCell>{item.description}</DataGridTextCell>;
};

export const RoadmapChangelogItemReleaseDateCell = ({
  item,
}: {
  item: any;
}) => {
  return <DataGridTextCell>{item.releaseDate}</DataGridTextCell>;
};

export const RoadmapChangelogItemStatusCell = ({ item }: { item: any }) => {
  const colors: Record<string, ODS_TEXT_COLOR_INTENT> = {
    Done: ODS_TEXT_COLOR_INTENT.success,
    'Partially released': ODS_TEXT_COLOR_INTENT.info,
    Planned: ODS_TEXT_COLOR_INTENT.default,
    Acknowledged: ODS_TEXT_COLOR_INTENT.warning,
    Prioritized: ODS_TEXT_COLOR_INTENT.accent,
  };
  return (
    <DataGridTextCell>
      <OsdsChip
        inline
        size={ODS_CHIP_SIZE.sm}
        color={colors[item.status]}
        className="whitespace-nowrap"
      >
        {item.status}
      </OsdsChip>
    </DataGridTextCell>
  );
};
