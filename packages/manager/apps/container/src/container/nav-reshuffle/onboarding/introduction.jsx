import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { usePopper } from 'react-popper';

import { useShell } from '@/context/useApplicationContext';
import { ONBOARDING_OPENED_STATE_ENUM } from '@/core/onboarding';
import useProductNavReshuffle from '@/core/product-nav-reshuffle';

import style from './style.module.scss';
import popoverStyle from '@/container/common/popover.module.scss';

export const OnboardingIntroduction = () => {
  const { t } = useTranslation('nav-reshuffle/onboarding');
  const [popoverButton, setPopoverButton] = useState();
  const [popover, setPopover] = useState();

  const { styles, attributes } = usePopper(popoverButton, popover, {
    placement: 'top-end',
  });

  const productNavReshuffle = useProductNavReshuffle();

  const [isBtnVisible, setIsBtnVisible] = useState(false);
  const [isPopoverVisible, setIsPopoverVisible] = useState(false);
  const [isChatbotVisible, setIsChatbotVisible] = useState(false);

  const shell = useShell();

  const user = shell
    .getPlugin('environment')
    .getEnvironment()
    .getUser();

  const uxPlugin = shell.getPlugin('ux');
  uxPlugin.onChatbotVisibilityChange(() => {
    setIsChatbotVisible(uxPlugin.shellUX.getChatbot().getVisibility());
    setIsPopoverVisible(false);
  });

  const openOnboarding = () => {
    productNavReshuffle.openOnboarding();
  };

  const startOnboarding = () => {
    productNavReshuffle.startOnboarding();
  };

  const closeOnboarding = () => {
    productNavReshuffle.closeOnboarding();
  };

  useEffect(() => {
    switch (productNavReshuffle.onboardingOpenedState) {
      case ONBOARDING_OPENED_STATE_ENUM.BUTTON:
        setIsBtnVisible(true);
        setIsPopoverVisible(false);
        break;
      case ONBOARDING_OPENED_STATE_ENUM.WELCOME:
        setIsBtnVisible(true);
        setIsPopoverVisible(true);
        break;
      default:
        setIsBtnVisible(false);
        setIsPopoverVisible(false);
        break;
    }
  }, [productNavReshuffle.onboardingOpenedState]);

  return (
    <div>
      {isBtnVisible && (
        <button
          type="button"
          className={`${style.onboardingButton} ${
            isChatbotVisible ? style.onboardingButton_padded : ''
          } oui-button oui-button_icon-left oui-button_l oui-button_primary`}
          onClick={() => openOnboarding()}
          ref={setPopoverButton}
          aria-expanded={isPopoverVisible}
        >
          <span className="oui-icon oui-icon-info"></span>
          <span className="oui-button__text">
            {t('onboarding_button_text')}
          </span>
        </button>
      )}

      {isPopoverVisible && (
        <div
          ref={setPopover}
          className={`${style.welcomePopover} ${popoverStyle.popover} oui-popover`}
          x-placement="top-end"
          style={styles.popper}
          {...attributes.popper}
        >
          <div className="oui-popover__content">
            <h2 className={popoverStyle['popover-header']}>
              {t('onboarding_introduction_popover_title', {
                userName: user.firstname,
              })}
            </h2>
            <div className={popoverStyle['popover-body']}>
              <p>{t('onboarding_introduction_popover_content')}</p>
              <small className="d-block mb-3">
                {t('onboarding_introduction_popover_extra')}
              </small>
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
      )}
    </div>
  );
};

export default OnboardingIntroduction;
