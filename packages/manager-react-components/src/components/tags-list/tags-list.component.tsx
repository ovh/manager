import React, { useEffect, useRef, useState } from 'react';
import { OdsBadge, OdsLink } from '@ovhcloud/ods-components/react';
import { OdsBadgeColor, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { calculateAuthorizedTags, truncateTag, filterTags } from './tags-utils';

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
  const color: OdsBadgeColor = 'neutral';
  const filteredTags = filterTags({ tags, displayInternalTags });
  const containerRef = useRef<HTMLDivElement>(null);
  const [truncate, setTruncate] = useState(null);
  const [visibleCount, setVisibleCount] = useState(filteredTags.length);
  const tagRefs = useRef<HTMLOdsBadgeElement[]>([]);
  const initialTagRefs = useRef<HTMLOdsBadgeElement[]>([]);

  useEffect(() => {
    if (filteredTags.length > 0) {
      const resizeObserver = new ResizeObserver(() => {
        const visibleTags = calculateAuthorizedTags(
          initialTagRefs.current,
          containerRef.current,
          lineNumber,
        );

        setVisibleCount(visibleTags || 1);

        if (visibleTags === 0 && tagRefs.current[0]) {
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
    return undefined;
  }, [filteredTags]);

  useEffect(() => {
    if (initialTagRefs.current.length === 0) {
      initialTagRefs.current = [...tagRefs.current];
    }
  }, []);

  return (
    Object.keys(tags).length > 0 && (
      <div ref={containerRef} className="w-full h-full min-w-[85px]">
        {truncate ? (
          <OdsBadge className="mr-1 mb-1" color={color} label={truncate} />
        ) : (
          filteredTags.slice(0, visibleCount).map((tag, index) => {
            return (
              <OdsBadge
                className="mr-1 mb-1"
                key={tag}
                ref={(el) => {
                  tagRefs.current[index] = el!;
                }}
                color={color}
                label={tag}
              />
            );
          })
        )}

        {visibleCount < filteredTags.length && (
          <OdsLink
            href="#"
            className="text-xs"
            onClick={(e) => {
              if (onClick) onClick();
              e.preventDefault();
            }}
            icon={ODS_ICON_NAME.chevronDoubleRight}
          />
        )}
      </div>
    )
  );
};
