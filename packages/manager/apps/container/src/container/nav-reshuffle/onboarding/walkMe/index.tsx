import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { createPopper, Instance, Placement } from '@popperjs/core';
import { debounce } from 'lodash-es';

import popoverStyle from '@/container/common/popover.module.scss';
import useProductNavReshuffle from '@/core/product-nav-reshuffle';
import { ONBOARDING_STATUS_ENUM } from '@/core/onboarding';
import { findNodeById } from '@/container/nav-reshuffle/sidebar/utils';
import { useShell } from '@/context';

import style from './style.module.scss';
import { Node } from '../../sidebar/navigation-tree/node';

const ELEMENT_OFFSET = 10;
const MOBILE_WIDTH_RESOLUTION = 1024;

export const OnboardingWalkMe = () => {
  const { t } = useTranslation('nav-reshuffle/onboarding');

  const stepElement = useRef();
  const popoverElement = useRef();
  const [arrowPlacement, setArrowPlacement] = useState<Placement>();
  const [popperInstance, setPopperInstance] = useState<Instance>();
  const trackingPlugin = useShell().getPlugin('tracking');

  const {
    closeOnboarding,
    openAccountSidebar,
    closeAccountSidebar,
    openNavigationSidebar,
    closeNavigationSidebar,
    onboardingOpenedState,
    currentNavigationNode,
    setCurrentNavigationNode,
    isMobile
  } = useProductNavReshuffle();
  const [currentUserNode, setCurrentUserNode] = useState<Node>({});

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);

  useEffect(() => {
    setCurrentUserNode({ ...currentNavigationNode });
  }, []);

  const commonTrackingOptions = {
    campaignId: '[tooltip-manager]',
    creation: '[general-onboarding]',
    detailedPlacement:
      onboardingOpenedState === ONBOARDING_STATUS_ENUM.DISPLAYED
        ? '[new_visitor]'
        : '[returning_visitor]',
  };
  const delay = (ms: number) => new Promise<void>((res) => setTimeout(res, ms));

  const steps = [
    {
      selector: '#header-user-menu-button',
      placement: 'bottom-start',
      title: t('onboarding_walkme_popover_step1_title'),
      content: t('onboarding_walkme_popover_step1_content'),
      trackingVariant: 'my_account',
      trackingLabel: 'access_my_account'
    },
    {
      selector: '#user-account-menu-profile',
      placement: 'left-start',
      mobilePlacement: 'bottom-start',
      title: t('onboarding_walkme_popover_step2_title'),
      content: t('onboarding_walkme_popover_step2_content'),
      trackingVariant: 'my_profile',
      trackingLabel: 'my_profile',
      onBeforeEnter: async () => {
        openAccountSidebar();
        const animationPromise = new Promise<void>((resolve) => {
          setTimeout(() => {
            resolve();
          }, 150);
        });

        return animationPromise;
      },
    },
    {
      selector: 'services',
      placement: 'left-start',
      mobilePlacement: 'bottom-start',
      title: t('onboarding_walkme_popover_step3_title'),
      content: t('onboarding_walkme_popover_step3_content'),
      trackingVariant: 'my_services',
      trackingLabel: 'see_products',
    },
    {
      selector: '#useful-links',
      placement: 'top-start',
      mobilePlacement: 'top-start',
      title: t('onboarding_walkme_popover_step4_title'),
      content: t('onboarding_walkme_popover_step4_content'),
      trackingVariant: '',
      trackingLabel: 'see_useful_links',
      onBeforeEnter: async () => {
        closeAccountSidebar();

        if (isMobile) {
          openNavigationSidebar();
        }

        // Waiting for DOM update
        await delay(100);
      },
    },
  ];

  const currentStepRank = useMemo(() => currentStepIndex + 1,[currentStepIndex]);
  const isLastStep = useMemo(() => currentStepIndex === (steps.length - 1),[currentStepIndex]);
  
  useEffect(() => {
    const currentStep = steps[currentStepIndex]
    if(currentStep){
      trackingPlugin.trackPage(`product-navigation-reshuffle::version_V3::modal_guided_tour::step-${currentStepRank}::${currentStep.trackingLabel}`);
    }
  }, [currentStepIndex]);

  const onHideBtnClick = (isDone?: boolean) => {
    const currentStep = steps[currentStepIndex];
    if(!isLastStep){
      trackingPlugin.trackClick({
        name: `modal_guided_tour_version_V3::product-navigation-reshuffle::step-${currentStepRank}::${currentStep.trackingLabel}::decline_modal_guided_tour`,
        type: 'action',
      });
    }

    trackingPlugin.trackClickImpression({
      click: {
        ...commonTrackingOptions,
        variant: `[${currentStep.trackingVariant}]`,
        format: `[${currentStepIndex + 1}-${steps.length}]`,
        generalPlacement: '[hide]',
      },
    });
    closeOnboarding(isDone);
    closeAccountSidebar();
    if (isMobile) {
      closeNavigationSidebar();
    }
  };

  const resizeObserver = new ResizeObserver((entries) => {
    entries.forEach((entry) => {
      const el: HTMLElement = stepElement.current;
      el.style.height = `${entry.borderBoxSize[0].blockSize + ELEMENT_OFFSET}px`;
    })
  })

  const onNextBtnClick = () => {
    const currentStep = steps[currentStepIndex];
    if(!isLastStep){
      trackingPlugin.trackClick({
        name: `modal_guided_tour_version_V3::product-navigation-reshuffle::step-${currentStepRank}::${currentStep.trackingLabel}::go_to_next_step`,
        type: 'action',
      });
    }

    trackingPlugin.trackClickImpression({
      click: {
        ...commonTrackingOptions,
        variant: `[${currentStep.trackingVariant}]`,
        format: `[${currentStepIndex + 1}-${steps.length}]`,
        generalPlacement: '[next]',
      },
    });
    if (currentStepIndex + 1 < steps.length) {
      setIsPopoverVisible(false);
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      setCurrentNavigationNode(currentUserNode);
      onHideBtnClick(true);
    }
  };

  const calculateTargetBound = useCallback(() => {
    const currentStep = steps[currentStepIndex];
    const updatePos = (targetPos: DOMRect) => {
      const el: HTMLElement = stepElement.current;

      const positionOffset = ELEMENT_OFFSET / 2;

      el.style.top = `${targetPos.top - positionOffset}px`;
      el.style.left = `${targetPos.left - positionOffset}px`;
      el.style.width = `${targetPos.width + ELEMENT_OFFSET}px`;
      el.style.height = `${targetPos.height + ELEMENT_OFFSET}px`;
    };
    let targetPos;
    if (currentStep.selector === 'services') {
      const elements = document.querySelectorAll('#menu li');
      const range = new Range();

      range.setStartBefore(elements[0]);
      range.setEndAfter(elements[elements.length - 1]);

      targetPos = range.getBoundingClientRect();
      updatePos(targetPos);
    } else {
      const targetElement = document.querySelector(currentStep.selector);
      targetPos = targetElement.getBoundingClientRect();
      resizeObserver.observe(targetElement);
      updatePos(targetPos);
    }
  }, [currentStepIndex, isMobile]);

  const updatePopper = useCallback(
    (interval = 350) => {
      const currentStep = steps[currentStepIndex];

      const placement = (isMobile && currentStep.mobilePlacement
        ? currentStep.mobilePlacement
        : currentStep.placement) as Placement;

      // Two impressions because we show two buttons
      // One for next and one for hide.
      trackingPlugin.waitForConfig().then(() => {
        trackingPlugin.trackImpression({
          ...commonTrackingOptions,
          variant: `[${currentStep.trackingVariant}]`,
          format: `[${currentStepIndex + 1}-${steps.length}]`,
          generalPlacement: '[next]',
        });
      });
      // add a timeout of the same time of the stepElement animation
      // before recalculating popper position
      setTimeout(() => {
        if (popperInstance) {
          popperInstance.setOptions({
            placement,
            modifiers: [
              {
                name: 'eventListeners',
                options: {
                  scroll: false,
                  resize: false,
                },
              },
            ],
          });
        } else {
          setPopperInstance(
            createPopper(stepElement.current, popoverElement.current, {
              placement,
            }),
          );
        }
        setIsPopoverVisible(true);
      }, interval);
    },
    [currentStepIndex],
  );

  const onWindowResize = useCallback(() => {
    setIsPopoverVisible(false);
    calculateTargetBound();
    updatePopper();
  }, [currentStepIndex]);

  useEffect(() => {
    setIsPopoverVisible(false);
    const currentStep = steps[currentStepIndex];

    const onBeforeEnter = currentStep.onBeforeEnter
      ? Promise.resolve(currentStep.onBeforeEnter())
      : Promise.resolve(true);

    onBeforeEnter.then(() => {
      calculateTargetBound();
      setArrowPlacement(
        (isMobile && currentStep.mobilePlacement
          ? currentStep.mobilePlacement
          : currentStep.placement) as Placement,
      );
      updatePopper(currentStepIndex === 0 ? 0 : 350);
    });

    const resizeHandler = debounce(onWindowResize, 100);
    window.addEventListener('resize', resizeHandler, false);

    return () => window.removeEventListener('resize', resizeHandler);
  }, [currentStepIndex]);

  return (
    <div className={style['onboarding-walkme']}>
      <div className={style['onboarding-walkme_overlay']}></div>
      <div className={style['onboarding-walkme_step']} ref={stepElement}></div>
      <div
        ref={popoverElement}
        className={`${style['onboarding-walkme_popover']} ${popoverStyle.popover} oui-popover`}
        data-x-placement={arrowPlacement}
        style={{ display: isPopoverVisible ? 'block' : 'none' }}
      >
        <div className="oui-popover__content">
          <h2 className={popoverStyle['popover-header']}>
            {steps[currentStepIndex].title}
          </h2>
          <div className={`${popoverStyle['popover-body']} mb-3`}>
            {steps[currentStepIndex].content}
          </div>
          <div className="d-flex flex-row-reverse justify-content-between">
            {currentStepIndex + 1 < steps.length ?
              <>
                <button
                  className="oui-button oui-button_primary"
                  onClick={onNextBtnClick}
                >
                  {t('onboarding_walkme_popover_next_step', {
                    current: currentStepIndex + 1,
                    total: steps.length,
                  })}
                </button>
                <button
                  className="oui-button oui-button_ghost"
                  onClick={() => onHideBtnClick()}
                >
                  {t('onboarding_popover_hide_button')}
                </button>
              </> :
              <button
                className="oui-button oui-button_primary"
                onClick={onNextBtnClick}
              >
                {t('onboarding_popover_done_button')}
              </button>
            }
          </div>
        </div>
        <div
          className={`${style['onboarding-walkme_popover_arrow']} oui-popover__arrow`}
          aria-hidden="true"
          data-popper-arrow
        ></div>
      </div>
    </div>
  );
};

export default OnboardingWalkMe;
