import React, { useState } from 'react';

import { useTranslation } from 'react-i18next';

import useContainer from '@/core/container';
import style from './style.module.scss';

import backgroundImage from '@/assets/images/pnr/background.png';
import previewImage from '@/assets/images/pnr/preview.png';
import useProductNavReshuffle from '@/core/product-nav-reshuffle';

function NavReshuffleBetaAccessModal(): JSX.Element {
  const { t } = useTranslation('beta-modal');
  const { askBeta, createBetaChoice } = useContainer();
  const [submitting, setSubmitting] = useState(false);

  function onAccept() {
    setSubmitting(true);
    return createBetaChoice(true).then(() => window.location.reload(false));
  }

  function onDecline() {
    setSubmitting(true);
    return createBetaChoice(false).then(() => window.location.reload(false));
  }

  return (
    <div className={`${style.backdrop} ${askBeta ? '' : style.hidden}`}>
      <div
        className={`${style.modal} ${submitting ? style.hidden : ''}`}
        style={{ backgroundImage: `url(${backgroundImage})` }}
        role="dialog"
        aria-modal="true"
      >
        <div className={style.leftCol}>
          <h1>{t('beta_modal_title')}</h1>
          <p>{t('beta_modal_infos')}</p>
          <button
            type="button"
            className="oui-button oui-button_primary mb-2"
            onClick={onAccept}
          >
            {t('beta_modal_accept')}
          </button>
          <button
            type="button"
            className="oui-button oui-button_link"
            onClick={onDecline}
          >
            <span>{t('beta_modal_decline')}</span>
            <span
              className="oui-icon oui-icon-arrow-right"
              aria-hidden="true"
            ></span>
          </button>
        </div>
        <div className={style.rightCol}>
          <img
            src={previewImage}
            alt={t('beta_modal_screenshot')}
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
}

export default NavReshuffleBetaAccessModal;
