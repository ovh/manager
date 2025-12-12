import { GuidePlacement } from '../../hooks/useGuidedTour/useGuidedTour.type';
import { DEFAULT_POPOVER_WIDTH, DEFAULT_POPOVER_HEIGHT, DEFAULT_GAP, VIEWPORT_PADDING, POSITION_THRESHOLD } from './GuidedTour.constants';

/**
 * Position coordinates for the popover (viewport-relative, in pixels)
 */
export type PopoverPosition = {
  top: number;
  left: number;
};

/**
 * Parameters for computing popover position
 */
type ComputePopoverPositionParams = {
  /** Bounding rectangle of the target element to position relative to */
  rect: DOMRect;
  /** Preferred placement direction for the popover */
  placement: GuidePlacement;
  /** Optional actual popover dimensions (for accurate positioning) */
  popoverRect?: DOMRect;
  /** Space between target element and popover in pixels */
  gap?: number;
  /** Minimum padding from viewport edges in pixels */
  viewportPadding?: number;
};

/**
 * Finds the target element by CSS selector and returns its bounding rectangle.
 *
 * The bounding rectangle contains viewport-relative coordinates (top, left, width, height)
 * which are used to position the highlight frame and popover.
 *
 * @param anchor - CSS selector string (e.g., '#my-element', '[data-testid="button"]')
 * @returns DOMRect with element's position and dimensions, or null if element not found
 */
export const getTargetElementRect = (anchor: string): DOMRect | null => {
  const targetElement = document.querySelector(anchor);

  if (!targetElement) {
    return null;
  }

  return targetElement.getBoundingClientRect();
};

/**
 * Updates the position and size of the highlight frame around the target element.
 *
 * The highlight frame is a visual indicator that shows which element the guide is
 * pointing to. It's positioned with a small offset to create a border effect around
 * the target element.
 *
 * @param stepElement - The DOM element representing the highlight frame
 * @param rect - Bounding rectangle of the target element (from getBoundingClientRect)
 * @param offset - Pixel offset to add around the element (creates border spacing)
 */
export const updateStepHighlight = (
  stepElement: HTMLDivElement,
  rect: DOMRect,
  offset: number,
): void => {
  // Position frame with half offset on top/left to center the border around the element
  stepElement.style.top = `${rect.top - offset / 2}px`;
  stepElement.style.left = `${rect.left - offset / 2}px`;
  // Add full offset to width/height to create border on all sides
  stepElement.style.width = `${rect.width + offset}px`;
  stepElement.style.height = `${rect.height + offset}px`;
};

/**
 * Computes the optimal position for the popover relative to the target element.
 *
 * This function handles:
 * 1. Initial positioning based on the requested placement (top/bottom/left/right)
 * 2. Viewport boundary detection to prevent popover from going off-screen
 * 3. Smart placement swapping when there's insufficient space in the requested direction
 *    but more space in the opposite direction
 *
 * The popover will be repositioned if it would overflow the viewport, with intelligent
 * fallback to the opposite side when there's significantly more space available.
 *
 * @param params - Configuration object for popover positioning
 * @param params.rect - Bounding rectangle of the target element
 * @param params.placement - Preferred placement direction (Top/Bottom/Left/Right)
 * @param params.popoverRect - Optional actual popover dimensions (for accurate positioning)
 * @param params.gap - Space between target element and popover (default: DEFAULT_GAP)
 * @param params.viewportPadding - Minimum padding from viewport edges (default: VIEWPORT_PADDING)
 * @returns Object with top and left coordinates (viewport-relative, in pixels)
 */
export const computePopoverPosition = ({
  rect,
  placement,
  popoverRect,
  gap = DEFAULT_GAP,
  viewportPadding = VIEWPORT_PADDING,
}: ComputePopoverPositionParams): PopoverPosition => {
  // Use actual popover dimensions if available, otherwise fall back to defaults
  const popoverWidth = popoverRect?.width || DEFAULT_POPOVER_WIDTH;
  const popoverHeight = popoverRect?.height || DEFAULT_POPOVER_HEIGHT;

  let top = 0;
  let left = 0;

  // Calculate initial position based on requested placement
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

  // Calculate viewport boundaries
  const maxViewportTop = window.innerHeight - popoverHeight - viewportPadding;
  const maxViewportLeft = window.innerWidth - popoverWidth - viewportPadding;

  // Handle vertical overflow (top/bottom)
  if (top < viewportPadding) {
    if (placement === GuidePlacement.Top) {
      // For top placement, check if should swap to bottom
      const spaceAbove = rect.top;
      const spaceBelow = window.innerHeight - rect.bottom;
      const minRequiredSpace = popoverHeight + gap + viewportPadding;

      // Swap to bottom if significantly more space below AND enough room for popover
      if (spaceBelow > spaceAbove * POSITION_THRESHOLD && spaceBelow >= minRequiredSpace) {
        top = rect.bottom + gap;
      } else {
        // Not enough space below, clamp to top
        top = viewportPadding;
      }
    } else {
      // For other placements clamp to top
      top = viewportPadding;
    }
  } else if (top > maxViewportTop) {
    if (placement === GuidePlacement.Bottom) {
      // For bottom placement check if should swap to top
      const spaceAbove = rect.top;
      const spaceBelow = window.innerHeight - rect.bottom;
      const minRequiredSpace = popoverHeight + gap + viewportPadding;

      // Swap to top if more space above AND enough room for popover
      if (spaceAbove > spaceBelow * POSITION_THRESHOLD && spaceAbove >= minRequiredSpace) {
        top = rect.top - popoverHeight - gap;
      } else {
        // Not enough space above, clamp to bottom
        top = maxViewportTop;
      }
    } else {
      // For other placements clamp to bottom
      top = Math.max(viewportPadding, maxViewportTop);
    }
  }

  // Handle horizontal overflow (left/right)
  if (left < viewportPadding) {
    left = viewportPadding;
  } else if (left > maxViewportLeft) {
    left = Math.max(viewportPadding, maxViewportLeft);
  }

  return { top, left };
};


