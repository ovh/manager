import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import addDays from 'date-fns/addDays';
import isAfter from 'date-fns/isAfter';
import { useTranslation } from 'react-i18next';

import useProductNavReshuffle from '@/core/product-nav-reshuffle';

import { LOCAL_STORAGE_ITEM, REDISPLAY_DAYS_INTERVAL } from './constants';
import style from './style.module.scss';
import popoverStyle from '../../common/popover.module.scss';

export const NavReshuffleFeedbackWidget = (): JSX.Element => {
  const { t } = useTranslation('nav-reshuffle/feedback');
  const {
    feedbackWidgetOpened,
    openFeedbackWidget,
    closeFeebackWidget,
  } = useProductNavReshuffle();

  // check for visibility
  const isBoxVisible = () => {
    const storedInfo = localStorage.getItem(LOCAL_STORAGE_ITEM);

    if (!storedInfo) {
      return true;
    }

    const { timestamp } = JSON.parse(storedInfo);

    const redisplayDate = addDays(new Date(timestamp), REDISPLAY_DAYS_INTERVAL);
    return isAfter(new Date(), redisplayDate);
  };

  const storeFeedbackStatus = () => {
    return localStorage.setItem(
      LOCAL_STORAGE_ITEM,
      JSON.stringify({
        timestamp: new Date().getTime(),
      }),
    );
  };

  const onGiveFeedbackLinkClick = () => {
    storeFeedbackStatus();
    closeFeebackWidget();
  };

  const onHideBtnClick = () => {
    storeFeedbackStatus();
    closeFeebackWidget();
  };

  useEffect(() => {
    // check for box visibility
    // the box should be visible each 2 days
    if (!localStorage.getItem(LOCAL_STORAGE_ITEM)) {
      // if no localStorage item then create one
      storeFeedbackStatus();
    }
    // check if the last put in localStorage is older than 2 days
    if (isBoxVisible()) {
      openFeedbackWidget();
    }
  }, []);

  return (
    <>
      {feedbackWidgetOpened && (
        <div
          className={`${style.feedbackWidget} ${popoverStyle.popover} oui-popover`}
        >
          <div className="oui-popover__content">
            <h2>{t('title')}</h2>
            <p>{t('content')}</p>
            <div className="d-flex flex-row-reverse justify-content-between">
              <a
                className="oui-button oui-button_primary"
                href={'#'}
                onClick={onGiveFeedbackLinkClick}
              >
                {t('give_feedback_link')}
              </a>
              <button
                className="oui-button oui-button_ghost"
                onClick={onHideBtnClick}
              >
                {t('hide_button')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NavReshuffleFeedbackWidget;
