import { useEffect, useRef, useState, useCallback } from 'react';
import { useGuide } from './useGuide';
import { GuidePlacement } from './useGuide.type';
import { BADGE_COLOR, BADGE_SIZE, Button, BUTTON_VARIANT } from '@ovhcloud/ods-react';
import { OdsBadge } from '@ovhcloud/ods-components/react';

const ELEMENT_OFFSET = 10;

export const Guide = () => {
  const {
    steps,
    currentStep,
    isActive,
    goNext,
    goPrevious,
    isFirstStep,
    isLastStep,
    stop,
  } = useGuide();

  const stepElementRef = useRef<HTMLDivElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);
  const [popoverPosition, setPopoverPosition] = useState<{
    top: number;
    left: number;
  } | null>(null);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const currentStepData = steps[currentStep];

  const calculateTargetBounds = useCallback(() => {
    if (!currentStepData || !stepElementRef.current) return;

    const anchor = currentStepData.anchor;
    const targetElement = document.querySelector(anchor);

    if (!targetElement) {
      return;
    }

    // Get bounding client rect
    const rect = targetElement.getBoundingClientRect();

    // Update highlight frame position
    const stepElement = stepElementRef.current;
    stepElement.style.top = `${rect.top - ELEMENT_OFFSET / 2}px`;
    stepElement.style.left = `${rect.left - ELEMENT_OFFSET / 2}px`;
    stepElement.style.width = `${rect.width + ELEMENT_OFFSET}px`;
    stepElement.style.height = `${rect.height + ELEMENT_OFFSET}px`;

    // Get placement
    const placement = currentStepData.placement || GuidePlacement.Bottom;
    const gap = 12; // Smaller gap between element and popover
    // Get actual popover dimensions if available, otherwise use estimates
    const popoverRect = popoverRef.current?.getBoundingClientRect();
    const popoverWidth = popoverRect?.width || 320;
    const popoverHeight = popoverRect?.height || 150;
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

    const viewportPadding = 16;
    const maxViewportTop = window.innerHeight - popoverHeight - viewportPadding;
    const maxViewportLeft = window.innerWidth - popoverWidth - viewportPadding;

    if (top < viewportPadding) {
      if (placement === GuidePlacement.Top) {
        const spaceAbove = rect.top;
        const spaceBelow = window.innerHeight - rect.bottom;
        const minRequiredSpace = popoverHeight + gap + viewportPadding;

        // Only swap if there is more space below AND enough space for the popover
        if (spaceBelow > spaceAbove * 1.5 && spaceBelow >= minRequiredSpace) {
          top = rect.bottom + gap;
        } else {
          // Keep at top but clamp to viewport
          top = viewportPadding;
        }
      } else {
        top = viewportPadding;
      }
    } else if (top > maxViewportTop) {
      // If bottom is out of bounds
      if (placement === GuidePlacement.Bottom) {
        // For bottom placement, check if we should swap to top or just adjust
        const spaceAbove = rect.top;
        const spaceBelow = window.innerHeight - rect.bottom;
        const minRequiredSpace = popoverHeight + gap + viewportPadding;

        // Only swap if there's significantly more space above AND enough space for the popover
        if (spaceAbove > spaceBelow * 1.5 && spaceAbove >= minRequiredSpace) {
          top = rect.top - popoverHeight - gap;
        } else {
          // Keep at bottom but clamp to viewport
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

    setPopoverPosition({ top, left });
  }, [currentStepData]);

  const handleWindowResize = useCallback(() => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  useEffect(() => {
    if (!isActive || !currentStepData) {
      setIsPopoverVisible(false);
      return;
    }

    let recalcTimer: NodeJS.Timeout | null = null;
    let rafId: number | null = null;
    let isScrolling = false;

    // Optimized scroll handler
    const handleScroll = () => {
      if (!isScrolling) {
        isScrolling = true;
        rafId = requestAnimationFrame(() => {
          calculateTargetBounds();
          isScrolling = false;
        });
      }
    };

    // Wait for DOM to update after navigation
    const timer = setTimeout(() => {
      calculateTargetBounds();
      setIsPopoverVisible(true);
      recalcTimer = setTimeout(() => {
        calculateTargetBounds();
      }, 50);
    }, 100);

    window.addEventListener('resize', handleWindowResize);
    window.addEventListener('scroll', handleScroll, { passive: true, capture: true });
    document.addEventListener('scroll', handleScroll, { passive: true, capture: true });
    document.body.addEventListener('scroll', handleScroll, { passive: true, capture: true });

    return () => {
      clearTimeout(timer);
      if (recalcTimer) {
        clearTimeout(recalcTimer);
      }
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
      window.removeEventListener('resize', handleWindowResize);
      window.removeEventListener('scroll', handleScroll, { capture: true });
      document.removeEventListener('scroll', handleScroll, { capture: true });
      document.body.removeEventListener('scroll', handleScroll, { capture: true });
    };
  }, [isActive, currentStep, currentStepData, calculateTargetBounds, handleWindowResize]);

  useEffect(() => {
    if (isPopoverVisible) {
      calculateTargetBounds();
    }
  }, [isPopoverVisible, calculateTargetBounds]);

  useEffect(() => {
    calculateTargetBounds();
  }, [windowSize, calculateTargetBounds]);

  const handleNext = () => {
    if (currentStepData?.onAfterEnter) {
      currentStepData.onAfterEnter();
    }
    goNext();
  };

  const handlePrevious = () => {
    goPrevious();
  };

  const handleClose = () => {
    stop();
  };

  if (!isActive || !currentStepData) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      <div className="absolute inset-0 pointer-events-auto" />
      <div
        ref={stepElementRef}
        className="absolute border-[3px] border-blue-500 rounded shadow-[0_0_0_9999px_rgba(0,80,215,0.75),0_0_20px_rgba(0,80,215,0.75)] pointer-events-none z-[10000] transition-all duration-300"
      />
      <div
        ref={popoverRef}
        className={`absolute bg-white rounded-lg shadow-lg min-w-[300px] max-w-[450px] z-[10001] pointer-events-auto ${
          isPopoverVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
        } transition-all duration-300`}
        style={{
          display: isPopoverVisible ? 'block' : 'none',
          top: popoverPosition?.top ? `${popoverPosition.top}px` : 'auto',
          left: popoverPosition?.left ? `${popoverPosition.left}px` : 'auto',
          maxHeight: `${window.innerHeight - 32}px`,
          overflowY: 'auto',
        }}
      >
        <div className="p-5 relative flex flex-col max-h-full">
          <div className="flex justify-end">
            <OdsBadge
              color={BADGE_COLOR.information}
              label={`${currentStep + 1} / ${steps.length}`}
              size={BADGE_SIZE.sm}
            />
          </div>
          <div className="mb-5 text-gray-800 leading-relaxed overflow-y-auto flex-1 min-h-0">
            {currentStepData.text}
          </div>
          <div className="flex flex-row gap-2 items-center">
            <div className="flex-grow">
            {!isFirstStep && (
              <Button
                variant={BUTTON_VARIANT.ghost}
                onClick={handlePrevious}
              >
                Previous
              </Button>
            )}
            </div>

            {!isFirstStep && <Button
              variant={BUTTON_VARIANT.outline}
              onClick={handleClose}
            >
              Skip
            </Button>}
            <Button
              variant={BUTTON_VARIANT.default}
              onClick={handleNext}
            >
              {isLastStep ? 'Done' : 'Next'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Guide;

