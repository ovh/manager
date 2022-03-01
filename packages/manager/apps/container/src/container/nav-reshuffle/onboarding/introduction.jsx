import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Overlay from 'react-bootstrap/Overlay';
import Popover from 'react-bootstrap/Popover';

import { useShell } from '@/context/useApplicationContext';
import useOnboarding from '@/core/onboarding';

import style from './style.module.scss';
import popoverStyle from '@/container/common/popover.module.scss';

export const OnboardingIntroduction = () => {
  const { t } = useTranslation('nav-reshuffle/onboarding');
  // const {} = useOnboarding();
  const popoverContainer = useRef(null);
  const popoverButton = useRef(null);

  const {
    hideOnboardingWidget,
    isLetsGoBtnVisible,
    isWelcomePopoverVisible,
    toggleWelcomPopoverVisibility,
    startWalkMe,
  } = useOnboarding();

  const user = useShell()
    .getPlugin('environment')
    .getEnvironment()
    .getUser();

  return (
    <div ref={popoverContainer}>
      {isLetsGoBtnVisible && (
        <button
          type="button"
          className={`${style.onboardingButton} oui-button oui-button_icon-left oui-button_l oui-button_primary`}
          onClick={toggleWelcomPopoverVisibility}
          ref={popoverButton}
          aria-expanded={isWelcomePopoverVisible}
        >
          <span className="oui-icon oui-icon-info"></span>
          <span className="oui-button__text">
            {t('onboarding_button_text')}
          </span>
        </button>
      )}

      <Overlay
        show={isWelcomePopoverVisible}
        placement="top-end"
        container={popoverContainer}
        transition={false}
        target={popoverButton}
      >
        <Popover
          className={`${style.welcomePopover} ${popoverStyle.popover} oui-popover`}
        >
          <Popover.Title as="h2" className={popoverStyle['popover-header']}>
            {t('onboarding_introduction_popover_title', {
              userName: user.firstname,
            })}
          </Popover.Title>
          <Popover.Content className={popoverStyle['popover-body']}>
            <p>{t('onboarding_introduction_popover_content')}</p>
            <small className="d-block mb-3">
              {t('onboarding_introduction_popover_extra')}
            </small>
          </Popover.Content>
          <div className="d-flex flex-row-reverse justify-content-between">
            <button
              className="oui-button oui-button_primary"
              onClick={() => startWalkMe()}
            >
              {t('onboarding_popover_follow_guide_button')}
            </button>
            <button
              className="oui-button oui-button_ghost"
              onClick={() => hideOnboardingWidget()}
            >
              {t('onboarding_popover_hide_button')}
            </button>
          </div>
        </Popover>
      </Overlay>
    </div>
  );
};

export default OnboardingIntroduction;
