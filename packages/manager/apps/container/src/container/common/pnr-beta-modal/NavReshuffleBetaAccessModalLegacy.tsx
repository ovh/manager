import React, { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';

import useContainer from '@/core/container';
import style from './style.module.scss';

import backgroundImage from '@/assets/images/pnr/background.png';
import previewImage from '@/assets/images/pnr/preview.png';
import { useShell } from '@/context';


function NavReshuffleBetaAccessModal(): JSX.Element {
  const { t } = useTranslation('beta-modal');
  const shell = useShell();
  const trackingPlugin = shell.getPlugin('tracking');
  const { betaAcknowledged, acknowledgeBeta, createBetaChoice } = useContainer();
  const [submitting, setSubmitting] = useState(false);

  function onAccept() {
    setSubmitting(true);
    trackingPlugin.trackClick({
      name: 'switch_versionpopin_V3::product-navigation-reshuffle::go_to_new_version',
      type: 'action',
    });
    acknowledgeBeta();
    createBetaChoice(true).then(() => window.location.reload());
  }

  function onDecline() {
    setSubmitting(false);
    trackingPlugin.trackClick({
      name: 'switch_versionpopin_V3::product-navigation-reshuffle:::decline_new_version',
      type: 'action',
    });
    acknowledgeBeta();
  }

  useEffect(() => {
    if (betaAcknowledged) {
      trackingPlugin.trackPage('product-navigation-reshuffle::switch_version_V3::go_to_new_version');
    }
  }, [betaAcknowledged]);

  if (betaAcknowledged) return null;

  return (
    <div className={`${style.backdrop}`}>
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
            {t('beta_modal_accept_old')}
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