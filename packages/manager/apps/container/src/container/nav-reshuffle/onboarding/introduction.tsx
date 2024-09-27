import useProductNavReshuffle from '@/core/product-nav-reshuffle';
import popoverStyle from '@/container/common/popover.module.scss';
import modalStyle from '@/container/common/modal.module.scss';
import { useShell } from '@/context/useApplicationContext';
import useClickAway from 'react-use/lib/useClickAway';
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import style from './style.module.scss';
import useOnboarding, {
  ONBOARDING_OPENED_STATE_ENUM,
  ONBOARDING_STATUS_ENUM,
} from '@/core/onboarding';

export const OnboardingIntroduction = () => {
  const { t } = useTranslation('nav-reshuffle/onboarding');

  const ref = useRef();
  const refConfirm = useRef(null);

  const productNavReshuffle = useProductNavReshuffle();
  const onboarding = useOnboarding();

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
      });
    }
  }, [isPopoverVisible]);

  useEffect(() => {
    setIsPopoverVisible(productNavReshuffle.onboardingOpenedState === ONBOARDING_OPENED_STATE_ENUM.WELCOME);
  }, [productNavReshuffle.onboardingOpenedState]);

  useEffect(() => {
    if (refConfirm.current) {
      refConfirm.current.focus();
    }
  })

  return (
    <>
      {isPopoverVisible && (
        <>
          <div
            className={`${modalStyle.popoverClickAway} ${isPopoverVisible ? '' : modalStyle.hidden
              }`}
          ></div>
          <div
            className={`${style.welcomePopover} ${popoverStyle.popover} oui-popover`}
            ref={ref}
          >
            <div className={style.welcomePopoverBody}>
              <h2 className={popoverStyle['popover-header']}>
                {t('onboarding_introduction_popover_title', {
                  userName: user.firstname,
                })}
              </h2>
              <div className={popoverStyle['popover-body']}>
                <p>{t('onboarding_introduction_popover_content')}</p>
              </div>
            </div>
            <div className={style.welcomePopoverFooter}>
              <button
                className="oui-button oui-button_ghost"
                onClick={() => closeOnboarding()}
              >
                {onboarding.shouldShowOnboardingNextTime ? t('onboarding_popover_later_hide_button') : t('onboarding_popover_do_not_show_again_button')}
              </button>
              <button
                className="oui-button oui-button_primary"
                onClick={() => startOnboarding()}
                ref={refConfirm}
              >
                {t('onboarding_popover_follow_guide_button')}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default OnboardingIntroduction;
