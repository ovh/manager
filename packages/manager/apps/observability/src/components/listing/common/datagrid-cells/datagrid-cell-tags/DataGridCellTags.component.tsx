import React from 'react';

import { BADGE_COLOR, BADGE_SIZE, Badge } from '@ovh-ux/muk';

import { DataGridCellTagsProps } from './DataGridCellTags.props';

export default function DatagridTenantCellTags({ tags }: DataGridCellTagsProps) {
  if (!tags || !tags.length) {
    return <></>;
  }

  return (
    <div className="grid grid-cols-3 gap-3 w-max">
      {tags.map((tag: string, index: number) => (
        <Badge key={`tag-${index}`} size={BADGE_SIZE.md} color={BADGE_COLOR.neutral}>
          {tag}
        </Badge>
      ))}
    </div>
  );
}
