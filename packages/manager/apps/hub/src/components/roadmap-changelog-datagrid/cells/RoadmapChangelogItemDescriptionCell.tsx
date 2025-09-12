import { OsdsLink } from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { DataGridTextCell } from '@ovh-ux/manager-react-components';
import {
  OdsHTMLAnchorElementTarget,
  OdsHTMLAnchorElementRel,
} from '@ovhcloud/ods-common-core';
import { RoadmapChangelogItem } from '@/types/roadmapchangelog.type';

export const RoadmapChangelogItemDescriptionCell = ({
  item,
}: {
  item: RoadmapChangelogItem;
}) => {
  return (
    <DataGridTextCell>
      <OsdsLink
        href={item.url}
        color={ODS_THEME_COLOR_INTENT.primary}
        role="link"
        target={OdsHTMLAnchorElementTarget._blank}
        rel={OdsHTMLAnchorElementRel.external}
      >
        {item.url}
      </OsdsLink>
    </DataGridTextCell>
  );
};
