import { OsdsButton } from '@ovhcloud/ods-components/react';
import { ODS_BUTTON_SIZE, ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { useTranslation } from 'react-i18next';
import { useFeatureAvailability } from '@ovh-ux/manager-react-components';
import { BETA_MANAGER_FEATURE, BETA_MANAGER_URL } from './BetaManagerButton.constants';

export default function BetaManagerButton(): JSX.Element {
  const { t } = useTranslation('beta-modal');

  const { data: availability } = useFeatureAvailability([BETA_MANAGER_FEATURE]);
  const isBetaManagerAvailable = availability?.[BETA_MANAGER_FEATURE];

  if (!isBetaManagerAvailable) {
    return <></>;
  }

  return (
    <OsdsButton
    size={ODS_BUTTON_SIZE.sm}
    variant={ODS_BUTTON_VARIANT.flat}
    color={ODS_THEME_COLOR_INTENT.primary}
    href={BETA_MANAGER_URL}
    className="ml-3"
  >
    {t('manager_beta_button')}
  </OsdsButton>
  );
}
