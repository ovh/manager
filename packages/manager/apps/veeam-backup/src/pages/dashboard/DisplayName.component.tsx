import { OdsButton, OdsText } from '@ovhcloud/ods-components/react';
import { useNavigate } from 'react-router-dom';
import {
  VeeamBackup,
  getVeeamBackupDisplayName,
} from '@ovh-ux/manager-module-vcd-api';
import { urls } from '@/routes/routes.constant';
import TEST_IDS from '@/utils/testIds.constants';

export const DisplayNameWithEditButton = (backup: VeeamBackup): JSX.Element => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center">
      <OdsText className="max-w-[80%]">
        {getVeeamBackupDisplayName(backup)}
      </OdsText>
      {/* IAM not implemented on services */}
      <OdsButton
        label=""
        className="ml-auto"
        data-testid={TEST_IDS.editNameCta}
        onClick={() =>
          navigate(
            urls.editVeeamDisplayNameFromDashboard.replace(':id', backup.id),
          )
        }
        variant="ghost"
        type="button"
        size="sm"
        isDisabled={backup.resourceStatus !== 'READY'}
        icon="pen"
      />
    </div>
  );
};
