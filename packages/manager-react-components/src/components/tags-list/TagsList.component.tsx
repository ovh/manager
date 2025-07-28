import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Badge, BADGE_COLOR, Icon, ICON_NAME, Link } from '@ovhcloud/ods-react';
import { filterTags, getVisibleTagCount } from './TagsList.utils';
import { TagsListProps } from './TagsList.props';
import { BADGE_SPACINGS, MORE_TAGS_ICON_WIDTH } from './TagsList.constants';
import { HTMLBadgeElement } from './TagsList.type';

export const TagsList: React.FC<TagsListProps> = ({
  tags,
  displayInternalTags = false,
  maxLines = null,
  onClick,
}) => {
  const filteredTags = useMemo(
    () => filterTags({ tags, displayInternalTags }),
    [tags, displayInternalTags],
  );
  const [visibleTagCount, setVisibleTagCount] = useState<number>(0);
  const [maxWidth, setMaxWidth] = useState<number>();
  const containerRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLBadgeElement>(null);

  useEffect(() => {
    // Display all tags if maxLines is not set
    if (!maxLines) {
      setVisibleTagCount(filteredTags.length - 1);
    } else if (
      filteredTags.length > 1 &&
      tagRef.current &&
      containerRef.current
    ) {
      const resizeObserver = new ResizeObserver(() => {
        const visibleTags = getVisibleTagCount(
          filteredTags,
          tagRef.current as HTMLBadgeElement,
          containerRef.current as HTMLDivElement,
          maxLines,
        );

        setVisibleTagCount(visibleTags);
      });
      if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
      }

      return () => resizeObserver.disconnect();
    }
    return () => {};
  }, [filteredTags, maxLines]);

  useEffect(() => {
    if (containerRef.current) {
      setMaxWidth(
        containerRef.current.offsetWidth -
          BADGE_SPACINGS -
          MORE_TAGS_ICON_WIDTH,
      );
    }
  }, [containerRef]);

  if (filteredTags.length === 0) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex flex-wrap min-w-[85px]"
    >
      <Badge
        className="mr-1 mb-1 truncate inline-block"
        color={BADGE_COLOR.neutral}
        ref={tagRef}
        style={{
          maxWidth: `${maxWidth}px`,
        }}
      >
        {filteredTags[0]}
      </Badge>
      {filteredTags.slice(1, visibleTagCount + 1).map((tag) => {
        return (
          <Badge
            className="mr-1 mb-1 truncate inline-block"
            key={tag}
            color={BADGE_COLOR.neutral}
            style={{
              maxWidth: `${maxWidth}px`,
            }}
          >
            {tag}
          </Badge>
        );
      })}

      {visibleTagCount + 1 < filteredTags.length && (
        <Link
          href="#"
          className="text-xs"
          onClick={(e: React.MouseEvent<HTMLLinkElement>) => {
            if (onClick) onClick();
            e.preventDefault();
          }}
        >
          <Icon name={ICON_NAME.chevronDoubleRight} />
        </Link>
      )}
    </div>
  );
};
