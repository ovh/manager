import { HTMLBadgeElement } from './TagsStack.type';
import { MORE_TAGS_ICON_WIDTH } from './TagsStack.constants';

const getBadgeSpacings = (badgeStyles: CSSStyleDeclaration) => {
  return (
    parseFloat(badgeStyles.marginRight) +
    parseFloat(badgeStyles.marginLeft) +
    parseFloat(badgeStyles.paddingLeft) +
    parseFloat(badgeStyles.paddingRight)
  );
};

const getRenderedBadgeWidth = ({
  tag,
  fontSize,
  fontFamily,
}: {
  tag: string;
  fontSize: number;
  fontFamily: string;
}) => {
  const canvas = document.createElement('canvas') as HTMLCanvasElement;
  const context = canvas.getContext('2d') as CanvasRenderingContext2D;
  context.font = `${fontSize} ${fontFamily}`;
  return context.measureText(tag).width;
};

export const getVisibleTagCount = (
  tags: string[],
  badge: HTMLBadgeElement,
  container: HTMLDivElement,
  maxLines: number,
): number => {
  const { offsetWidth: containerWidth } = container;

  const currentBadgeStyles = window.getComputedStyle(badge);

  const BADGE_SPACINGS = getBadgeSpacings(currentBadgeStyles);

  const BADGE_FONT_SIZE = parseFloat(currentBadgeStyles.fontSize);
  const BADGE_FONT_FAMILY = currentBadgeStyles.fontFamily;

  let currentLine = 1;
  // first badge is already displayed thus removing it's space from available space
  let availableWidth = containerWidth - badge.offsetWidth - BADGE_SPACINGS;
  let count = 0;
  let index = 1;

  // calculating the number of visible tags using flex behaviour
  // 1. calculate the space required to display the tag
  // 2. If tag can be displayed in available space, allocate the space for current tag and update availableWidth
  // 3. Else if tag cannot be displayed in availableWidth in current line, push the tag to next line and update availableWidth in next line
  // 4. If tag requires entire line, then allocate the entire line for the current tag and increment currentLine by 1
  while (currentLine <= maxLines && index < tags.length) {
    const textWidth =
      getRenderedBadgeWidth({
        tag: tags[index] as string,
        fontSize: BADGE_FONT_SIZE,
        fontFamily: BADGE_FONT_FAMILY,
      }) + BADGE_SPACINGS;

    if (textWidth > availableWidth) {
      if (currentLine !== maxLines) {
        currentLine += 1;
        // allocate space for displaying more tags link for the last line
        availableWidth =
          containerWidth -
          textWidth -
          (currentLine === maxLines ? MORE_TAGS_ICON_WIDTH : 0);
      } else {
        break;
      }
    } else {
      availableWidth -= textWidth;
    }
    count += 1;
    index += 1;
  }
  return count;
};
