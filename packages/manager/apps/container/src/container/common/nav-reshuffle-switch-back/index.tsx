import { useTranslation } from 'react-i18next';

import {
  OsdsText,
  OsdsRadioButton,
  OsdsRadio,
  OsdsRadioGroup,
  OsdsButton,
} from '@ovhcloud/ods-components/react';
import {
  ODS_RADIO_BUTTON_SIZE,
  ODS_TEXT_SIZE,
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useShell } from '@/context';
import useContainer from '@/core/container';

function NavReshuffleSwitchBack(): JSX.Element {
  const { t } = useTranslation('beta-modal');
  const { updateBetaChoice, betaVersion, useBeta } = useContainer();
  const shell = useShell();
  const trackingPlugin = shell.getPlugin('tracking');

  if (!betaVersion) {
    return <></>;
  }

  const toggleVersion = (value: 'classic' | 'beta') => {
    const versionName = value === 'beta' ? 'new' : 'old';
    trackingPlugin.trackClick({
      name: `topnav::switch_version_V3::go_to_${versionName}_version`,
      type: 'navigation',
    });
    updateBetaChoice(value === 'beta');
  };

  return (
    <div className="flex items-center">
      <OsdsRadioGroup name="version" className="flex">
        <OsdsRadio
          name="version"
          value="classic"
          onOdsCheckedChange={() => toggleVersion('classic')}
          checked={!useBeta}
          className="mr-1"
        >
          <OsdsRadioButton
            size={ODS_RADIO_BUTTON_SIZE.xs}
            color={ODS_THEME_COLOR_INTENT.primary}
          >
            <span slot="end">
              <OsdsText
                size={ODS_TEXT_SIZE._400}
                color={ODS_THEME_COLOR_INTENT.text}
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
            size={ODS_RADIO_BUTTON_SIZE.xs}
            color={ODS_THEME_COLOR_INTENT.primary}
          >
            <span slot="end">
              <OsdsText
                size={ODS_TEXT_SIZE._400}
                color={ODS_THEME_COLOR_INTENT.text}
              >
                {t('beta_modal_new')}
              </OsdsText>
            </span>
          </OsdsRadioButton>
        </OsdsRadio>
      </OsdsRadioGroup>

      <OsdsButton
        size={ODS_BUTTON_SIZE.sm}
        variant={ODS_BUTTON_VARIANT.flat}
        color={ODS_THEME_COLOR_INTENT.primary}
        href="/beta/#/"
        className="ml-3"
      >
        {t('manager_beta_button')}
      </OsdsButton>
    </div>
  );
}

export default NavReshuffleSwitchBack;
