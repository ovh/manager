import { useTranslation } from 'react-i18next';
import { Button } from '@ovh-ux/muk';
import { BUTTON_VARIANT } from '@ovhcloud/ods-react';
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
    <div className="flex gap-2 p-[2px] bg-white rounded-lg w-fit mx-2 min-h-[34px]">
      <Button
        variant={!useBeta ? BUTTON_VARIANT.default : BUTTON_VARIANT.ghost}
        onClick={() => toggleVersion('classic')}
        className="min-w-16 rounded-lg text-sm p-1 min-h-[32px]"
        disabled={!useBeta}
      >
        {t('beta_modal_old')}
      </Button>
      <Button
        variant={useBeta ? BUTTON_VARIANT.default : BUTTON_VARIANT.ghost}
        onClick={() => toggleVersion('beta')}
        className="min-w-16 rounded-lg text-sm p-1 min-h-[32px]"
        disabled={useBeta}
      >
        {t('beta_modal_new')}
      </Button>
    </div>
  );
}

export default NavReshuffleSwitchBack;
