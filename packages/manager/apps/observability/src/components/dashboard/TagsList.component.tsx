import { useState } from 'react';

import {
  BADGE_COLOR,
  BUTTON_SIZE,
  BUTTON_VARIANT,
  Badge,
  Button,
  ICON_NAME,
  Icon,
  Skeleton,
} from '@ovhcloud/ods-react';

import { TagsTileProps } from './TagsTile.props';

type TagsListProps = Pick<TagsTileProps, 'tags' | 'isLoading'> & {
  maxVisibleTags?: number;
};

export const TagsList = ({ tags, isLoading, maxVisibleTags }: TagsListProps) => {
  const [showAllTags, setShowAllTags] = useState(false);

  const tagEntries = tags ? Object.entries(tags) : [];
  const displayedTags = showAllTags ? tagEntries : tagEntries.slice(0, maxVisibleTags);
  const shouldShowToggle = maxVisibleTags && !isLoading && tagEntries.length > maxVisibleTags;

  const toggleShowMoreTags = () => setShowAllTags((prev) => !prev);

  return (
    <div className="mb-4 flex flex-wrap items-center gap-4">
      {isLoading ? (
        <Skeleton />
      ) : (
        displayedTags.map(([tagKey, tagValue]) => (
          <Badge key={tagKey} color={BADGE_COLOR.neutral}>
            {tagKey}:{tagValue}
          </Badge>
        ))
      )}

      {shouldShowToggle && (
        <Button variant={BUTTON_VARIANT.ghost} size={BUTTON_SIZE.xs} onClick={toggleShowMoreTags}>
          <Icon
            className="text-sm text-[var(--ods-color-primary-500)]"
            name={showAllTags ? ICON_NAME.chevronDoubleLeft : ICON_NAME.chevronDoubleRight}
          />
        </Button>
      )}
    </div>
  );
};

export default TagsList;
