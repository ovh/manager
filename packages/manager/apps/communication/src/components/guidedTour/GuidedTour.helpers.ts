import { GuidePlacement } from '../../hooks/useGuidedTour/useGuidedTour.type';
import { DEFAULT_POPOVER_WIDTH, DEFAULT_POPOVER_HEIGHT, DEFAULT_GAP, VIEWPORT_PADDING, POSITION_THRESHOLD } from './GuidedTour.constants';

export type PopoverPosition = {
  top: number;
  left: number;
};

type ComputePopoverPositionParams = {
  rect: DOMRect;
  placement: GuidePlacement;
  popoverRect?: DOMRect;
  gap?: number;
  viewportPadding?: number;
};

export const getTargetElementRect = (anchor: string): DOMRect | null => {
  const targetElement = document.querySelector(anchor);

  if (!targetElement) {
    return null;
  }

  return targetElement.getBoundingClientRect();
};

export const updateStepHighlight = (
  stepElement: HTMLDivElement,
  rect: DOMRect,
  offset: number,
): void => {
  stepElement.style.top = `${rect.top - offset / 2}px`;
  stepElement.style.left = `${rect.left - offset / 2}px`;
  stepElement.style.width = `${rect.width + offset}px`;
  stepElement.style.height = `${rect.height + offset}px`;
};

export const computePopoverPosition = ({
  rect,
  placement,
  popoverRect,
  gap = DEFAULT_GAP,
  viewportPadding = VIEWPORT_PADDING,
}: ComputePopoverPositionParams): PopoverPosition => {
  const popoverWidth = popoverRect?.width || DEFAULT_POPOVER_WIDTH;
  const popoverHeight = popoverRect?.height || DEFAULT_POPOVER_HEIGHT;

  let top = 0;
  let left = 0;

  switch (placement) {
    case GuidePlacement.Top:
      top = rect.top - popoverHeight - gap;
      left = rect.left + rect.width / 2 - popoverWidth / 2;
      break;
    case GuidePlacement.Bottom:
      top = rect.bottom + gap;
      left = rect.left + rect.width / 2 - popoverWidth / 2;
      break;
    case GuidePlacement.Left:
      top = rect.top + rect.height / 2 - popoverHeight / 2;
      left = rect.left - popoverWidth - gap;
      break;
    case GuidePlacement.Right:
      top = rect.top + rect.height / 2 - popoverHeight / 2;
      left = rect.right + gap;
      break;
  }

  const maxViewportTop = window.innerHeight - popoverHeight - viewportPadding;
  const maxViewportLeft = window.innerWidth - popoverWidth - viewportPadding;

  if (top < viewportPadding) {
    if (placement === GuidePlacement.Top) {
      const spaceAbove = rect.top;
      const spaceBelow = window.innerHeight - rect.bottom;
      const minRequiredSpace = popoverHeight + gap + viewportPadding;

      if (spaceBelow > spaceAbove * POSITION_THRESHOLD && spaceBelow >= minRequiredSpace) {
        top = rect.bottom + gap;
      } else {
        top = viewportPadding;
      }
    } else {
      top = viewportPadding;
    }
  } else if (top > maxViewportTop) {
    if (placement === GuidePlacement.Bottom) {
      const spaceAbove = rect.top;
      const spaceBelow = window.innerHeight - rect.bottom;
      const minRequiredSpace = popoverHeight + gap + viewportPadding;

      if (spaceAbove > spaceBelow * POSITION_THRESHOLD && spaceAbove >= minRequiredSpace) {
        top = rect.top - popoverHeight - gap;
      } else {
        top = maxViewportTop;
      }
    } else {
      top = Math.max(viewportPadding, maxViewportTop);
    }
  }

  if (left < viewportPadding) {
    left = viewportPadding;
  } else if (left > maxViewportLeft) {
    left = Math.max(viewportPadding, maxViewportLeft);
  }

  return { top, left };
};


