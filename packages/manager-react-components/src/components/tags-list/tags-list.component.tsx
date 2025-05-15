import React, { useEffect, useRef, useState } from 'react';
import { OdsBadge, OdsLink } from '@ovhcloud/ods-components/react';
import { OdsBadgeColor, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { calculateAuthorizedTags, truncateTag } from './tags-utils';
import { useTagsFilter } from '../../hooks/tags-list/useTagsFilter';

export interface TagsListProps {
  tags: { [key: string]: string };
  displayInternalTags?: boolean;
  lineNumber?: number;
  onClick?: () => void;
}

export const TagsList: React.FC<TagsListProps> = ({
  tags,
  displayInternalTags = false,
  lineNumber,
  onClick,
}) => {
  const color: OdsBadgeColor = 'information';
  const filteredTags = useTagsFilter({ tags, displayInternalTags });
  const containerRef = useRef<HTMLDivElement>(null);
  const [truncate, setTruncate] = useState(null);
  const [visibleCount, setVisibleCount] = useState(filteredTags.length);
  const tagRefs = useRef<HTMLOdsBadgeElement[]>([]);

  useEffect(() => {
    if (filteredTags.length > 0) {
      const resizeObserver = new ResizeObserver(() => {
        const visibleTags = calculateAuthorizedTags(
          tagRefs.current,
          containerRef.current,
          lineNumber,
        );

        setVisibleCount(visibleTags || 1);

        if (visibleTags === 0) {
          setTruncate(
            truncateTag(
              containerRef.current,
              tagRefs.current[0],
              filteredTags[0],
            ),
          );
        }
      });

      if (containerRef.current) {
        resizeObserver.observe(containerRef.current);
      }

      return () => resizeObserver.disconnect();
    }
  }, [filteredTags]);

  return (
    <div
      ref={containerRef}
      data-testid="container"
      style={{ width: '100%', height: '100%', minWidth: '85px' }}
    >
      {truncate && (
        <OdsBadge className="mr-1 mb-1" color={color} label={truncate} />
      )}

      {!truncate &&
        filteredTags.slice(0, visibleCount).map((tag, index) => {
          return (
            <OdsBadge
              className="mr-1 mb-1"
              key={index}
              ref={(el) => (tagRefs.current[index] = el!)}
              color={color}
              label={tag}
            />
          );
        })}

      {visibleCount < filteredTags.length && (
        <OdsLink
          href="#"
          className="text-xs"
          onClick={onClick}
          icon={ODS_ICON_NAME.chevronDoubleRight}
        />
      )}
    </div>
  );
};
