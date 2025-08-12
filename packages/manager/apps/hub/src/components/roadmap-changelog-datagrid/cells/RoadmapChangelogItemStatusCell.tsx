import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import { ODS_CHIP_SIZE, ODS_TEXT_COLOR_INTENT } from '@ovhcloud/ods-components';
import { OsdsChip } from '@ovhcloud/ods-components/react';

export const RoadmapChangelogItemStatusCell = ({ item }: { item: any }) => {
  const colors: Record<string, ODS_TEXT_COLOR_INTENT> = {
    Done: ODS_TEXT_COLOR_INTENT.success,
    'Partially released': ODS_TEXT_COLOR_INTENT.info,
    Planned: ODS_TEXT_COLOR_INTENT.accent,
    Acknowledged: ODS_TEXT_COLOR_INTENT.default,
    Prioritized: ODS_TEXT_COLOR_INTENT.warning,
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
