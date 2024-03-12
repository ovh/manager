import React, { useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useTranslation } from 'react-i18next';

import useContainer from '@/core/container';
import { SMALL_DEVICE_MAX_SIZE } from '@/container/common/constants';
import { useShell } from '@/context';
import {
  OsdsText,
  OsdsRadioButton,
  OsdsRadio,
  OsdsRadioGroup,
} from '@ovhcloud/ods-stencil/components/react';
import { OdsRadioButtonSize, OdsTextSize } from '@ovhcloud/ods-core';
import { OdsThemeColorIntent } from '@ovhcloud/ods-theming';
import NavReshuffleSwitchBackModal from '@/container/common/nav-reshuffle-switch-back/Modal';

function NavReshuffleSwitchBack(): JSX.Element {
  const { t } = useTranslation('beta-modal');
  const { updateBetaChoice, betaVersion, useBeta } = useContainer();
  const shell = useShell();
  const trackingPlugin = shell.getPlugin('tracking');
  const isSmallDevice = useMediaQuery({
    query: `(max-width: ${SMALL_DEVICE_MAX_SIZE})`,
  });
  const [confirm, setConfirm] = useState<boolean>(false);

  if (!betaVersion || isSmallDevice) {
    return <></>;
  }

  const toggleVersion = (value: 'classic' | 'beta') => {
    const versionName = value === 'beta' ? 'new' : 'old';
    trackingPlugin.trackClick({
      name: `topnav::switch_version::go_to_${versionName}_version`,
      type: 'navigation',
    });
    updateBetaChoice(value === 'beta');
  };

  const switchBack = (openSurvey = false) => {
    if (openSurvey) {
      window.open(
        'https://survey.ovh.com/index.php/813778',
        '_blank',
        'noopener',
      );
    }
    toggleVersion('classic');
  };

  return (
    <>
      <OsdsRadioGroup name="version" className="d-flex">
        <OsdsRadio
          name="version"
          value="classic"
          onOdsCheckedChange={() => setConfirm(true)}
          checked={!useBeta}
          className="mr-1"
        >
          <OsdsRadioButton
            size={OdsRadioButtonSize.sm}
            color={OdsThemeColorIntent.primary}
          >
            <span slot="end">
              <OsdsText
                size={OdsTextSize._400}
                color={OdsThemeColorIntent.text}
              >
                {t('beta_modal_old')}
              </OsdsText>
            </span>
          </OsdsRadioButton>
        </OsdsRadio>

        <OsdsRadio
          name="version"
          value="beta"
          onOdsCheckedChange={() => toggleVersion('beta')}
          checked={useBeta}
        >
          <OsdsRadioButton
            size={OdsRadioButtonSize.sm}
            color={OdsThemeColorIntent.primary}
          >
            <span slot="end">
              <OsdsText
                size={OdsTextSize._400}
                color={OdsThemeColorIntent.text}
              >
                {t('beta_modal_new')}
              </OsdsText>
            </span>
          </OsdsRadioButton>
        </OsdsRadio>
      </OsdsRadioGroup>
      {confirm && (
        <NavReshuffleSwitchBackModal
          onCancel={() => {
            setConfirm(false);
          }}
          onConfirm={(openSurvey = false) => {
            switchBack(openSurvey);
          }}
        />
      )}
    </>
  );
}

export default NavReshuffleSwitchBack;
