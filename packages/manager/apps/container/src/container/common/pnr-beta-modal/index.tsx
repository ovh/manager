import { useEffect, useState } from 'react';

import { useTranslation } from 'react-i18next';

import useContainer from '@/core/container';

import backgroundImage from '@/assets/images/pnr/background.png';
import { useShell } from '@/context';
import { OsdsButton, OsdsText } from '@ovhcloud/ods-components/react';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';

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

  if (betaAcknowledged) return null;

  return (
    <div
      className="absolute top-0 left-0 right-0 bottom-0 z-[2000] flex items-center justify-center"
      style={{
        backgroundColor: 'rgba(0, 80, 215, 0.75)',
      }}
    >
      <div
        className="min-w-[30rem] max-w-[40rem] rounded-lg bg-white shadow-xl p-8"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
        }}
        role="dialog"
        aria-modal="true"
      >
        <OsdsText
          color={ODS_THEME_COLOR_INTENT.primary}
          level={ODS_TEXT_LEVEL.heading}
          size={ODS_TEXT_SIZE._300}
        >
          {t('beta_modal_title')}
        </OsdsText>
        <div className="flex flex-col gap-1 mt-2 mb-4">
          <OsdsText
            color={ODS_THEME_COLOR_INTENT.text}
            size={ODS_TEXT_SIZE._400}
            level={ODS_TEXT_LEVEL.body}
            className="mb-0"
          >
            {t('beta_modal_greeting', { user: user.firstname })}
          </OsdsText>
          <OsdsText
            color={ODS_THEME_COLOR_INTENT.text}
            size={ODS_TEXT_SIZE._400}
            level={ODS_TEXT_LEVEL.body}
            className="mb-2"
          >
            {t('beta_modal_welcome')}
          </OsdsText>
          <OsdsText
            color={ODS_THEME_COLOR_INTENT.text}
            size={ODS_TEXT_SIZE._400}
            level={ODS_TEXT_LEVEL.body}
            className="mb-2"
          >
            {t('beta_modal_info')}
          </OsdsText>
          <OsdsText
            color={ODS_THEME_COLOR_INTENT.text}
            size={ODS_TEXT_SIZE._400}
            level={ODS_TEXT_LEVEL.body}
          >
            {t('beta_modal_explore')}
          </OsdsText>
        </div>
        <OsdsButton
          color={ODS_THEME_COLOR_INTENT.primary}
          size={ODS_BUTTON_SIZE.sm}
          onClick={onAccept}
          inline
        >
          {t('beta_modal_accept')}
        </OsdsButton>
      </div>
    </div>
  );
}

export default NavReshuffleBetaAccessModal;
