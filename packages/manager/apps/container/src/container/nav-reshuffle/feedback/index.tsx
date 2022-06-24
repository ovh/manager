import React from 'react';
import { useTranslation } from 'react-i18next';

import { useShell } from '@/context/useApplicationContext';
import useProductNavReshuffle from '@/core/product-nav-reshuffle';

import style from './style.module.scss';

export const NavReshuffleFeedbackWidget = (): JSX.Element => {
  const { t } = useTranslation('nav-reshuffle/feedback');
  const trackingPlugin = useShell().getPlugin('tracking');
  const feedbackUrl = useProductNavReshuffle().getFeedbackUrl();

  const onGiveFeedbackLinkClick = () => {
    trackingPlugin.trackClick({
      name: 'float_band::user_widget::give_feedback',
      type: 'action',
    });
  };

  return (
    <a
      className={`${style.feedbackWidget} oui-link_icon py-1 px-2`}
      target="_blank"
      rel="noopener noreferrer"
      href={feedbackUrl}
      aria-label={t('title')}
      onClick={onGiveFeedbackLinkClick}
    >
      <i className="oui-icon oui-icon-chat" aria-hidden="true"></i>
      <span>{t('title')}</span>
    </a>
  );
};

export default NavReshuffleFeedbackWidget;
