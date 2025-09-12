import { OsdsLink } from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import { RoadmapChangelogItem } from '@/types/roadmapchangelog.type';

export const RoadmapChangelogItemDescriptionCell = ({
  item,
}: {
  item: RoadmapChangelogItem;
}) => {
  return (
    <DataGridTextCell>
      <OsdsLink href={item.url} color={ODS_THEME_COLOR_INTENT.primary}>
        {item.url}
      </OsdsLink>
    </DataGridTextCell>
  );
};
