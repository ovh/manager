import { useRef, useState, useEffect, MouseEvent, FC } from 'react';
import { Badge, BADGE_COLOR, Icon, ICON_NAME, Link } from '@ovhcloud/ods-react';
import { getVisibleTagCount } from './TagsStack.utils';
import { HTMLBadgeElement } from './TagsStack.type';
import { BADGE_SPACINGS, MORE_TAGS_ICON_WIDTH } from './TagsStack.constants';
import { TagsStackProps } from './TagsStack.props';

export const TagsStack: FC<TagsStackProps> = ({ tags, maxLines, onClick }) => {
  const [visibleTagCount, setVisibleTagCount] = useState<number>(0);
  const [maxWidth, setMaxWidth] = useState<number>();
  const containerRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLBadgeElement>(null);

  useEffect(() => {
    // Display all tags if maxLines is not set
    if (!maxLines) {
      setVisibleTagCount(tags.length - 1);
    } else if (tags.length > 1 && tagRef.current && containerRef.current) {
      const resizeObserver = new ResizeObserver(() => {
        const visibleTags = getVisibleTagCount(
          tags,
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
  }, [tags, maxLines]);

  useEffect(() => {
    if (containerRef.current) {
      setMaxWidth(
        containerRef.current.offsetWidth -
          BADGE_SPACINGS -
          MORE_TAGS_ICON_WIDTH,
      );
    }
  }, [containerRef]);

  if (!tags.length) {
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
        {tags[0]}
      </Badge>
      {tags.slice(1, visibleTagCount + 1).map((tag) => {
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

      {visibleTagCount + 1 < tags.length && (
        <Link
          href="#"
          className="text-xs"
          onClick={(e: MouseEvent<HTMLLinkElement>) => {
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
