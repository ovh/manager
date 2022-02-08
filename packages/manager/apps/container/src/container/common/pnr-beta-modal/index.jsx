import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useReket } from '@ovh-ux/ovh-reket';

import style from './style.module.scss';
import backgroundImage from '@/assets/images/pnr/background.png';
import previewImage from '@/assets/images/pnr/preview.png';

const BETA_ACCESS_KEY = 'NAV_RESHUFFLE_BETA_ACCESS';

export default function NavReshuffleBetaAccessModal() {
  const { t } = useTranslation('beta-modal');
  const [submitting, setSubmitting] = useState(false);
  const [visible, setVisible] = useState(false);
  const reketInstance = useReket();

  useEffect(() => {
    // if user preference doesn't exists display the modal
    reketInstance
      .get(`/me/preferences/manager/${BETA_ACCESS_KEY}`)
      .catch(() => setVisible(true));
  }, []);

  function onAccept() {
    setSubmitting(true);
    reketInstance.post('/me/preferences/manager', {
      key: BETA_ACCESS_KEY,
      value: 'true',
    });
  }

  function onDecline() {
    setSubmitting(true);
    reketInstance.post('/me/preferences/manager', {
      key: BETA_ACCESS_KEY,
      value: 'false',
    });
  }

  return (
    <div className={`${style.backdrop} ${visible ? '' : style.hidden}`}>
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
