import React from 'react';
import { OsdsIcon } from '@ovhcloud/ods-components/react';
import { useNavigate } from 'react-router-dom';
import { Description, ManagerButton } from '@ovh-ux/manager-react-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_BUTTON_TYPE,
} from '@ovhcloud/ods-components';
import { VeeamBackupWithIam, getVeeamBackupDisplayName } from '@/data';
import { iamActions } from '@/veeam-backup.config';
import { urls } from '@/routes/routes.constant';

export const DisplayNameWithEditButton = (
  backup: VeeamBackupWithIam,
): JSX.Element => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center">
      <Description>{getVeeamBackupDisplayName(backup)}</Description>
      <ManagerButton
        className="ml-4"
        iamActions={[iamActions.iamResourceEdit]}
        urn={backup?.iam?.urn}
        onClick={() =>
          navigate(
            urls.editVeeamDisplayNameFromDashboard.replace(':id', backup.id),
          )
        }
        circle
        variant={ODS_BUTTON_VARIANT.ghost}
        type={ODS_BUTTON_TYPE.button}
        size={ODS_BUTTON_SIZE.sm}
      >
        <OsdsIcon
          name={ODS_ICON_NAME.PEN}
          size={ODS_ICON_SIZE.xs}
          color={ODS_THEME_COLOR_INTENT.primary}
        />
      </ManagerButton>
    </div>
  );
};
