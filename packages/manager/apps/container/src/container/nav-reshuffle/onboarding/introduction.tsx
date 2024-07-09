import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import useClickAway from 'react-use/lib/useClickAway';

import { useShell } from '@/context/useApplicationContext';
import {
  ONBOARDING_OPENED_STATE_ENUM,
  ONBOARDING_STATUS_ENUM,
} from '@/core/onboarding';
import useProductNavReshuffle from '@/core/product-nav-reshuffle';

import style from './style.module.scss';
import popoverStyle from '@/container/common/popover.module.scss';
import modalStyle from '@/container/common/modal.module.scss';

export const OnboardingIntroduction = () => {
  const { t } = useTranslation('nav-reshuffle/onboarding');

  const ref = useRef();

  const productNavReshuffle = useProductNavReshuffle();
  const shell = useShell();

  const user = shell
    .getPlugin('environment')
    .getEnvironment()
    .getUser();

  const [isPopoverVisible, setIsPopoverVisible] = useState(false);

  const trackingPlugin = shell.getPlugin('tracking');
  const commonTrackingOptions = {
    campaignId: '[tooltip-manager]',
    creation: '[general-onboarding]',
    variant: '[welcome_message]',
    detailedPlacement:
      productNavReshuffle.onboardingOpenedState ===
      ONBOARDING_STATUS_ENUM.DISPLAYED
        ? '[new_visitor]'
        : '[returning_visitor]',
  };

  const startOnboarding = () => {
    productNavReshuffle.startOnboarding();
    trackingPlugin.trackClickImpression({
      click: {
        ...commonTrackingOptions,
        format: '[0-4]',
        generalPlacement: '[next]',
      },
    });
  };

  const closeOnboarding = () => {
    productNavReshuffle.closeOnboarding();

    trackingPlugin.trackClickImpression({
      click: {
        ...commonTrackingOptions,
        generalPlacement: '[hide]',
        format: '[0-4]',
      },
    });
  };

  useClickAway(ref, () => {
    productNavReshuffle.reduceOnboarding();
  });

  useEffect(() => {
    if (isPopoverVisible) {
      trackingPlugin.waitForConfig().then(() => {
        trackingPlugin.trackImpression({
          ...commonTrackingOptions,
          generalPlacement: '[next]',
          format: '[0-4]',
        });
        trackingPlugin.trackImpression({
          ...commonTrackingOptions,
          generalPlacement: '[hide]',
          format: '[0-4]',
        });
      });
    }
  }, [isPopoverVisible]);

  useEffect(() => {
    setIsPopoverVisible(
      productNavReshuffle.onboardingOpenedState ===
        ONBOARDING_OPENED_STATE_ENUM.WELCOME,
    );
  }, [productNavReshuffle.onboardingOpenedState]);

  return (
    <>
      {isPopoverVisible && (
        <>
          <div
            className={`${modalStyle.popoverClickAway} ${
              isPopoverVisible ? '' : modalStyle.hidden
            }`}
          ></div>
          <div
            className={`${style.welcomePopover} ${popoverStyle.popover} oui-popover`}
            ref={ref}
          >
            <div className="oui-popover__content">
              <h2 className={popoverStyle['popover-header']}>
                {t('onboarding_introduction_popover_title', {
                  userName: user.firstname,
                })}
              </h2>
              <div className={popoverStyle['popover-body']}>
                <p>{t('onboarding_introduction_popover_content')}</p>
              </div>
              <div className="d-flex flex-row-reverse justify-content-between">
                <button
                  className="oui-button oui-button_primary"
                  onClick={() => startOnboarding()}
                >
                  {t('onboarding_popover_follow_guide_button')}
                </button>
                <button
                  className="oui-button oui-button_ghost"
                  onClick={() => closeOnboarding()}
                >
                  {t('onboarding_popover_hide_button')}
                </button>
              </div>
            </div>
            <div className="oui-popover__arrow" aria-hidden="true"></div>
          </div>
        </>
      )}
    </>
  );
};

export default OnboardingIntroduction;
