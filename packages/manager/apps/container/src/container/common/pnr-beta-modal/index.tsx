import React, { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';

import useContainer from '@/core/container';
import style from './style.module.scss';

import backgroundImage from '@/assets/images/pnr/background.png';
import { useShell } from '@/context';

function NavReshuffleBetaAccessModal(): JSX.Element {
  const { t } = useTranslation('beta-modal');
  const shell = useShell();
  const trackingPlugin = shell.getPlugin('tracking');
  const user = shell
    .getPlugin('environment')
    .getEnvironment()
    .getUser();
  const { betaAcknowledged, acknowledgeBeta } = useContainer();

  async function onAccept() {
    trackingPlugin.trackClick({
      name:
        'switch_versionpopin_V3::product-navigation-reshuffle::go_to_new_version',
      type: 'action',
    });

    acknowledgeBeta();
  }

  // useEffect(() => {
  //   if (askBeta) {
  //     trackingPlugin.trackPage('product-navigation-reshuffle::switch_version_V3::go_to_new_version');
  //   }
  // }, [askBeta]);

  if (betaAcknowledged) return null;

  return (
    <div className={`${style.backdrop}`}>
      <div
        className={`${style.modal}`}
        style={{ backgroundImage: `url(${backgroundImage})` }}
        role="dialog"
        aria-modal="true"
      >
        <h1>{t('beta_modal_title')}</h1>
        <div className="flex flex-col gap-1">
          <p className="mb-1">
            {t('beta_modal_greeting', { user: user.firstname })}
          </p>
          <p className="mb-2">{t('beta_modal_welcome')}</p>
          <p className="mb-2">{t('beta_modal_info')}</p>
          <p>{t('beta_modal_explore')}</p>
        </div>
        <button
          type="button"
          className="oui-button oui-button_primary mb-2"
          onClick={onAccept}
        >
          {t('beta_modal_accept')}
        </button>
      </div>
    </div>
  );
}

export default NavReshuffleBetaAccessModal;
