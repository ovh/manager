import { useTranslation } from 'react-i18next';

import { OsdsSelect, OsdsSelectOption } from '@ovhcloud/ods-components/react';
import { ODS_SELECT_SIZE } from '@ovhcloud/ods-components';
import { useShell } from '@/context';
import useContainer from '@/core/container';
import BetaManagerButton from './BetaManagerButton.component';

type NavigationVersion = 'classic' | 'beta';

function NavReshuffleSwitchBack(): JSX.Element {
  const { t } = useTranslation('beta-modal');
  const { updateBetaChoice, betaVersion, useBeta } = useContainer();
  const shell = useShell();
  const trackingPlugin = shell.getPlugin('tracking');

  if (!betaVersion) {
    return <BetaManagerButton />;
  }

  const currentVersion: NavigationVersion = useBeta ? 'beta' : 'classic';

  const toggleVersion = (value: NavigationVersion) => {
    if (value === currentVersion) return;
    const versionName = value === 'beta' ? 'new' : 'old';
    trackingPlugin.trackClick({
      name: `topnav::switch_version_V3::go_to_${versionName}_version`,
      type: 'navigation',
    });
    updateBetaChoice(value === 'beta');
  };

  return (
    <div className="flex items-center">
      <OsdsSelect
        data-testid="navigation_version_selector"
        size={ODS_SELECT_SIZE.md}
        value={currentVersion}
        onOdsValueChange={(event) =>
          toggleVersion(event.detail.value as NavigationVersion)
        }
      >
        <OsdsSelectOption value="classic">
          {t('beta_modal_old')}
        </OsdsSelectOption>
        <OsdsSelectOption value="beta">
          {t('beta_modal_new')}
        </OsdsSelectOption>
      </OsdsSelect>

      <BetaManagerButton />
    </div>
  );
}

export default NavReshuffleSwitchBack;
