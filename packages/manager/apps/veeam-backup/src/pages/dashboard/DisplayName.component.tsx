import React from 'react';
import { OsdsButton, OsdsIcon } from '@ovhcloud/ods-components/react';
import { useNavigate } from 'react-router-dom';
import { Description } from '@ovh-ux/manager-react-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_ICON_NAME,
  ODS_ICON_SIZE,
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_BUTTON_TYPE,
} from '@ovhcloud/ods-components';
import {
  VeeamBackup,
  getVeeamBackupDisplayName,
} from '@ovh-ux/manager-module-vcd-api';
import { urls } from '@/routes/routes.constant';

export const DisplayNameWithEditButton = (backup: VeeamBackup): JSX.Element => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center">
      <Description className="max-w-[80%]">
        {getVeeamBackupDisplayName(backup)}
      </Description>
      {/* IAM not implemented on services */}
      <OsdsButton
        className="ml-auto"
        data-testid="edit-name-button"
        onClick={() =>
          navigate(
            urls.editVeeamDisplayNameFromDashboard.replace(':id', backup.id),
          )
        }
        circle
        variant={ODS_BUTTON_VARIANT.ghost}
        type={ODS_BUTTON_TYPE.button}
        size={ODS_BUTTON_SIZE.sm}
        disabled={backup.resourceStatus !== 'READY' || undefined}
      >
        <OsdsIcon
          name={ODS_ICON_NAME.PEN}
          size={ODS_ICON_SIZE.xs}
          color={ODS_THEME_COLOR_INTENT.primary}
        />
      </OsdsButton>
    </div>
  );
};
