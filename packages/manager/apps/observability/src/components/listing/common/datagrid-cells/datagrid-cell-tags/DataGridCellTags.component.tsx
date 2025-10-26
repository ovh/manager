import { ODS_BADGE_COLOR, ODS_BADGE_SIZE } from '@ovhcloud/ods-components';
import { OdsBadge } from '@ovhcloud/ods-components/react';

import { DataGridCellTagsProps } from './DataGridCellTags.props';

export default function DatagridTenantCellTags({ tags }: DataGridCellTagsProps) {
  if (!tags || !tags.length) {
    return <></>;
  }

  return (
    <div className="grid grid-cols-3 gap-3 w-max">
      {tags.map((tag: string, index: number) => (
        <OdsBadge
          key={`tag-${index}`}
          size={ODS_BADGE_SIZE.md}
          color={ODS_BADGE_COLOR.neutral}
          label={tag}
        />
      ))}
    </div>
  );
}
