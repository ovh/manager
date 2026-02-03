import { useEffect, useRef, useState, useCallback } from 'react';
import { useGuidedTour } from '../../hooks/useGuidedTour/useGuidedTour.context';
import { GuidePlacement } from '../../hooks/useGuidedTour/useGuidedTour.type';
import { Badge, BADGE_COLOR, BADGE_SIZE, Card, Text, Button, BUTTON_SIZE, BUTTON_VARIANT } from '@ovhcloud/ods-react';
import {
  computePopoverPosition,
  getTargetElementRect,
  updateStepHighlight,
} from './GuidedTour.helpers';
import { useTranslation } from 'react-i18next';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { STEP_ELEMENT_OFFSET } from './GuidedTour.constants';

export default function GuidedTour(): JSX.Element | null {
  const {
    steps,
    currentStep,
    isActive,
    goNext,
    goPrevious,
    isFirstStep,
    isLastStep,
    stop,
  } = useGuidedTour();

  const { t } = useTranslation(NAMESPACES.ACTIONS);

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

    const rect = getTargetElementRect(currentStepData.anchor);
    if (!rect) return;

    updateStepHighlight(stepElementRef.current, rect, STEP_ELEMENT_OFFSET);

    const placement = currentStepData.placement || GuidePlacement.Bottom;
    const popoverRect = popoverRef.current?.getBoundingClientRect();

    const position = computePopoverPosition({
      rect,
      placement,
      popoverRect,
    });

    setPopoverPosition(position);
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
  }, [isPopoverVisible, windowSize, calculateTargetBounds]);

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
        className="absolute border-[3px] rounded shadow-[0_0_0_9999px_rgba(0,80,215,0.75),0_0_20px_rgba(0,80,215,0.75)] pointer-events-none z-[10000] transition-all duration-300"
      />
      <div ref={popoverRef}
        className={`absolute z-[10001] pointer-events-auto min-w-[300px] max-w-[450px] ${
          isPopoverVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
        } transition-all duration-300`}
        aria-hidden={!isPopoverVisible}
        role="dialog"
        style={{
          display: isPopoverVisible ? 'block' : 'none',
          top: popoverPosition?.top ? `${popoverPosition.top}px` : 'auto',
          left: popoverPosition?.left ? `${popoverPosition.left}px` : 'auto',
          maxHeight: `${window.innerHeight - 32}px`,
          overflowY: 'auto',
        }}
      >
        <Card className="bg-white w-full min-h-content">
          <div className="p-5 relative flex flex-col max-h-full">
            <div className="flex justify-end">
              <Badge
                color={BADGE_COLOR.information}
                size={BADGE_SIZE.sm}
              >
                {`${currentStep + 1} / ${steps.length}`}
              </Badge>
            </div>
            <Text className="flex-1 min-h-min mb-5 flex-1">{currentStepData.text}</Text>
            <div className="flex flex-row gap-4 items-center">
              <div className="flex-grow">
              {!isFirstStep && (
                <Button
                  variant={BUTTON_VARIANT.ghost}
                  size={BUTTON_SIZE.sm}
                  onClick={handlePrevious}
                >
                  {t('previous')}
                </Button>
              )}
              </div>

              {!isLastStep && <Button
                variant={BUTTON_VARIANT.outline}
                size={BUTTON_SIZE.sm}
                onClick={handleClose}
              >
                {t('close')}
              </Button>}
              <Button
                variant={BUTTON_VARIANT.default}
                size={BUTTON_SIZE.sm}
                onClick={handleNext}
              >
                {isLastStep ? t('end') : t('next')}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
