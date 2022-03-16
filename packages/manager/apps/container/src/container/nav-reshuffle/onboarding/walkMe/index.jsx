import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { createPopper } from '@popperjs/core';
import { debounce } from 'lodash-es';

import popoverStyle from '@/container/common/popover.module.scss';
import useProductNavReshuffle from '@/core/product-nav-reshuffle';
import { ONBOARDING_STATUS_ENUM } from '@/core/onboarding';

import style from './style.module.scss';

const ELEMENT_OFFSET = 10;
const MOBILE_WIDTH_RESOLUTION = 1024;

export const OnboardingWalkMe = () => {
  const { t } = useTranslation('nav-reshuffle/onboarding');

  const stepElement = useRef();
  const popoverElement = useRef();
  const [arrowPlacement, setArrowPlacement] = useState();
  const [popperInstance, setPopperInstance] = useState();

  const {
    closeOnboarding,
    openAccountSidebar,
    closeAccountSidebar,
    openNavigationSidebar,
    closeNavigationSidebar,
  } = useProductNavReshuffle();

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(
    window.innerWidth < MOBILE_WIDTH_RESOLUTION,
  );

  const steps = [
    {
      selector: '#header-user-menu-button',
      placement: 'bottom-start',
      title: t('onboarding_walkme_popover_step1_title'),
      content: t('onboarding_walkme_popover_step1_content'),
    },
    {
      selector: '#user-account-menu-profile',
      placement: 'left-start',
      mobilePlacement: 'bottom-start',
      title: t('onboarding_walkme_popover_step2_title'),
      content: t('onboarding_walkme_popover_step2_content'),
      onBeforeEnter: () => {
        openAccountSidebar();
        const animationPromise = new Promise((resolve) => {
          setTimeout(() => {
            resolve();
          }, 150);
        });
        return animationPromise;
      },
    },
    {
      selector: '#user-account-menu-payment-method',
      placement: 'left-start',
      mobilePlacement: 'bottom-start',
      title: t('onboarding_walkme_popover_step3_title'),
      content: t('onboarding_walkme_popover_step3_content'),
    },
    {
      selector: '#sidebar-link-services',
      placement: 'right-start',
      mobilePlacement: 'bottom-end',
      title: t('onboarding_walkme_popover_step4_title'),
      content: t('onboarding_walkme_popover_step4_content'),
      onBeforeEnter: () => {
        closeAccountSidebar();
        if (isMobile) {
          openNavigationSidebar();
        }
      },
    },
    {
      selector: '#sidebar-link-billing',
      placement: 'right-start',
      mobilePlacement: 'bottom-end',
      title: t('onboarding_walkme_popover_step5_title'),
      content: t('onboarding_walkme_popover_step5_content'),
    },
  ];

  const onHideBtnClick = (onboardingStatus) => {
    closeOnboarding(onboardingStatus);
    closeAccountSidebar();
    if (isMobile) {
      closeNavigationSidebar();
    }
  };

  const onNextBtnClick = () => {
    if (currentStepIndex + 1 < steps.length) {
      setIsPopoverVisible(false);
      setCurrentStepIndex(currentStepIndex + 1);
    } else {
      onHideBtnClick(ONBOARDING_STATUS_ENUM.DONE);
    }
  };

  const calculateTargetBound = useCallback(() => {
    const currentStep = steps[currentStepIndex];
    const targetElement = document.querySelector(currentStep.selector);
    const targetPos = targetElement.getBoundingClientRect();
    const el = stepElement.current;

    const positionOffset = ELEMENT_OFFSET / 2;

    el.style.top = `${targetPos.top - positionOffset}px`;
    el.style.left = `${targetPos.left - positionOffset}px`;
    el.style.width = `${targetPos.width + ELEMENT_OFFSET}px`;
    el.style.height = `${targetPos.height + ELEMENT_OFFSET}px`;
  }, [currentStepIndex, isMobile]);

  const updatePopper = useCallback(
    (interval = 350) => {
      const currentStep = steps[currentStepIndex];

      const placement =
        isMobile && currentStep.mobilePlacement
          ? currentStep.mobilePlacement
          : currentStep.placement;

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
    [currentStepIndex, isMobile],
  );

  const onWindowResize = useCallback(() => {
    setIsPopoverVisible(false);
    setIsMobile(window.innerWidth < MOBILE_WIDTH_RESOLUTION);
    calculateTargetBound();
    updatePopper();
  }, [currentStepIndex, isMobile]);

  useEffect(() => {
    setIsPopoverVisible(false);
    const currentStep = steps[currentStepIndex];

    const onBeforeEnter = currentStep.onBeforeEnter
      ? Promise.resolve(currentStep.onBeforeEnter())
      : Promise.resolve(true);

    onBeforeEnter.then(() => {
      calculateTargetBound();
      setArrowPlacement(
        isMobile && currentStep.mobilePlacement
          ? currentStep.mobilePlacement
          : currentStep.placement,
      );
      updatePopper(currentStepIndex === 0 ? 0 : 350);
    });

    const resizeHandler = debounce(onWindowResize, 100);
    window.addEventListener('resize', resizeHandler, false);

    return () => window.removeEventListener('resize', resizeHandler);
  }, [currentStepIndex, isMobile]);

  return (
    <div className={style['onboarding-walkme']}>
      <div className={style['onboarding-walkme_overlay']}></div>
      <div className={style['onboarding-walkme_step']} ref={stepElement}></div>
      <div
        ref={popoverElement}
        className={`${style['onboarding-walkme_popover']} ${popoverStyle.popover} oui-popover`}
        x-placement={arrowPlacement}
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
