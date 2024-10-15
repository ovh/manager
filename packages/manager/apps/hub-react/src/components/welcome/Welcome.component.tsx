import React, { useContext } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import {
  ODS_CHIP_SIZE,
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
} from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { OsdsChip, OsdsIcon, OsdsText } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';

export default function Welcome() {
  const { t } = useTranslation('hub');
  const { environment } = useContext(ShellContext);
  const { user } = environment;

  return (
    <>
      <OsdsText
        className="inline-block my-6"
        level={ODS_TEXT_LEVEL.heading}
        size={ODS_TEXT_SIZE._700}
        color={ODS_THEME_COLOR_INTENT.text}
      >
        {t('manager_hub_dashboard_welcome', { name: user.firstname })}
      </OsdsText>
      {user.isTrusted && (
        <OsdsChip
          color={ODS_THEME_COLOR_INTENT.success}
          size={ODS_CHIP_SIZE.sm}
          inline={true}
          className="mt-2 align-text-bottom trusted-nic-label"
          data-testid="snc_chip"
        >
          <OsdsIcon
            name={ODS_ICON_NAME.SHIELD_CONCEPT}
            size={ODS_ICON_SIZE.xs}
            color={ODS_THEME_COLOR_INTENT.text}
            className="self-center"
          />
          <OsdsText
            level={ODS_TEXT_LEVEL.heading}
            size={ODS_TEXT_SIZE._400}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {t('ovh_trusted_nic_label')}
          </OsdsText>
        </OsdsChip>
      )}
    </>
  );
}
