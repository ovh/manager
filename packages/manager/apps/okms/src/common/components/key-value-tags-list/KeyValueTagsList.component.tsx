import { ODS_BADGE_COLOR } from '@ovhcloud/ods-components';
import { OdsBadge } from '@ovhcloud/ods-components/react';

export type KeyValueTagsListProps = {
  tags: Record<string, string>;
};

export const KeyValueTagsList = ({ tags }: KeyValueTagsListProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      {Object.entries(tags).map(([key, value]) => {
        return <OdsBadge key={key} color={ODS_BADGE_COLOR.neutral} label={`${key}:${value}`} />;
      })}
    </div>
  );
};
