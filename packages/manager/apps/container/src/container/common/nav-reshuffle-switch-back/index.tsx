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
} from '@ovhcloud/ods-components/react';
import { ODS_RADIO_BUTTON_SIZE, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import useOnboarding from '@/core/onboarding';

function NavReshuffleSwitchBack(): JSX.Element {
  const { t } = useTranslation('beta-modal');
  const { updateBetaChoice, betaVersion, useBeta } = useContainer();
  const shell = useShell();
  const trackingPlugin = shell.getPlugin('tracking');
  const isSmallDevice = useMediaQuery({
    query: `(max-width: ${SMALL_DEVICE_MAX_SIZE})`,
  });
  const onboarding = useOnboarding();

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
    // Onboarding forced only for PNR V2 alpha; to remove for the beta.
    if (value === 'beta') onboarding.forceOnboardingDisplayed(true);
  };

  return (
    <>
      <OsdsRadioGroup name="version" className="d-flex">
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
    </>
  );
}

export default NavReshuffleSwitchBack;
