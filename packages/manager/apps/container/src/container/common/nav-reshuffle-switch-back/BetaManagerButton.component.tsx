import { useTranslation } from 'react-i18next';
import { useFeatureAvailability } from '@ovh-ux/manager-react-components';
import { useShell } from '@/context';
import {
  BETA_MANAGER_FEATURE,
  BETA_MANAGER_TRACKING_CLICK,
  BETA_MANAGER_URL,
} from './BetaManagerButton.constants';
import style from './BetaManagerButton.module.scss';

export default function BetaManagerButton(): JSX.Element {
  const { t } = useTranslation('beta-modal');
  const shell = useShell();

  const { data: availability } = useFeatureAvailability([BETA_MANAGER_FEATURE]);
  const isBetaManagerAvailable = availability?.[BETA_MANAGER_FEATURE];

  if (!isBetaManagerAvailable) {
    return <></>;
  }

  const handleClick = () => {
    shell.getPlugin('tracking').trackClick(BETA_MANAGER_TRACKING_CLICK);
  };

  return (
    <a
      href={BETA_MANAGER_URL}
      onClick={handleClick}
      className={`ml-3 ${style.betaManagerButton}`}
    >
      {t('manager_beta_button')}
      <span className={style.betaTag}>&gt;BETA_</span>
    </a>
  );
}
