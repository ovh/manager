import React from 'react';
import { useMediaQuery } from 'react-responsive';

import { useTranslation } from 'react-i18next';

import style from './style.module.scss';

import { SMALL_DEVICE_MAX_SIZE } from '@/container/common/constants';

type Props = {
  children?: JSX.Element;
  onClick(show: boolean): void;
  show?: boolean;
};

function LanguageButton({
  children = null,
  onClick,
  show = false,
}: Props): JSX.Element {
  const { t } = useTranslation('language');
  const isSmallDevice = useMediaQuery({
    query: `(max-width: ${SMALL_DEVICE_MAX_SIZE})`,
  });
  return (
    <button
      aria-haspopup={show}
      aria-expanded={show}
      aria-label={t('language_change')}
      title={t('language_change')}
      type="button"
      className={`oui-navbar-link oui-navbar-link_dropdown ${
        style.navbarFontSize
      } ${isSmallDevice ? 'p-0' : ''}`}
      onClick={(e) => {
        e.preventDefault();
        onClick(!show);
      }}
    >
      <span className="oui-navbar-link__wrapper">
        <span className="oui-navbar-link__text">{children}</span>
        {!isSmallDevice && (
          <span className="oui-icon oui-icon-chevron-down ml-2"></span>
        )}
      </span>
    </button>
  );
}

export default LanguageButton;
