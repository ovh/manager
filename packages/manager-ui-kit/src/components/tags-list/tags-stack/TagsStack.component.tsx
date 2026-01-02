import { FC, MouseEvent, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import { BADGE_COLOR, Badge, ICON_NAME, Icon, Link } from '@ovhcloud/ods-react';

import { BADGE_SPACINGS, MORE_TAGS_ICON_WIDTH } from './TagsStack.constants';
import { HTMLBadgeElement, TagsStackProps } from './TagsStack.props';
import { getVisibleTagCount } from './TagsStack.utils';

export const TagsStack: FC<TagsStackProps> = ({ tags, maxLines, onClick }) => {
  const [measuredVisibleCount, setMeasuredVisibleCount] = useState<number>(0);
  const [maxWidth, setMaxWidth] = useState<number>();

  const containerRef = useRef<HTMLDivElement>(null);
  const tagRef = useRef<HTMLBadgeElement>(null);

  const unlimitedVisibleCount = useMemo(() => Math.max(0, tags.length - 1), [tags.length]);

  const visibleTagCount = maxLines ? measuredVisibleCount : unlimitedVisibleCount;

  useLayoutEffect(() => {
    if (!maxLines) return;

    if (tags.length > 1 && tagRef.current && containerRef.current) {
      const next = getVisibleTagCount(tags, tagRef.current, containerRef.current, maxLines);
      setMeasuredVisibleCount((prev) => (prev === next ? prev : next));
    } else {
      setMeasuredVisibleCount((prev) => (prev === 0 ? prev : 0));
    }
  }, [maxLines, tags, tags.length]);

  useEffect(() => {
    if (!maxLines) return;
    if (tags.length <= 1 || !tagRef.current || !containerRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      if (!tagRef.current || !containerRef.current) return;

      const next = getVisibleTagCount(tags, tagRef.current, containerRef.current, maxLines);
      setMeasuredVisibleCount((prev) => (prev === next ? prev : next));
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, [maxLines, tags, tags.length]);

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const next = containerRef.current.offsetWidth - BADGE_SPACINGS - MORE_TAGS_ICON_WIDTH;

    setMaxWidth((prev) => (prev === next ? prev : next));
  }, [tags.length]);

  if (!tags.length) return null;

  return (
    <div ref={containerRef} className="w-full h-full flex flex-wrap min-w-[85px]">
      <Badge
        className="mr-1 mb-1 truncate inline-block"
        color={BADGE_COLOR.neutral}
        ref={tagRef}
        style={{ maxWidth: `${maxWidth}px` }}
      >
        {tags[0]}
      </Badge>

      {tags.slice(1, visibleTagCount + 1).map((tag) => (
        <Badge
          className="mr-1 mb-1 truncate inline-block"
          key={tag}
          color={BADGE_COLOR.neutral}
          style={{ maxWidth: `${maxWidth}px` }}
        >
          {tag}
        </Badge>
      ))}

      {visibleTagCount + 1 < tags.length && (
        <Link
          href="#"
          className="text-xs"
          onClick={(e: MouseEvent<HTMLLinkElement>) => {
            onClick?.();
            e.preventDefault();
          }}
        >
          <Icon name={ICON_NAME.chevronDoubleRight} />
        </Link>
      )}
    </div>
  );
};
