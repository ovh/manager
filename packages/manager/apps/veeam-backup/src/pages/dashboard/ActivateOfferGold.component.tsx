import { OdsBadge } from '@ovhcloud/ods-components/react';
import { ActionMenu } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useOvhTracking } from '@ovh-ux/manager-react-shell-client';
import { ODS_BUTTON_VARIANT, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import {
  VeeamBackupOffer,
  BackupResourceStatus,
  isStatusTerminated,
} from '@ovh-ux/manager-module-vcd-api';
import { TRACKING } from '@/tracking.constant';
import { urls } from '@/routes/routes.constant';
import TEST_IDS from '@/utils/testIds.constants';
import { OFFER_CREATING_STATUS } from '@/constants';

export const ActivateOfferGold = ({
  id,
  status,
  backupStatus,
}: {
  id: string;
  backupStatus: BackupResourceStatus;
  status?: VeeamBackupOffer['status'];
}): JSX.Element => {
  const { t: tStatus } = useTranslation(NAMESPACES.STATUS);
  const { t: tAction } = useTranslation(NAMESPACES.ACTIONS);
  const navigate = useNavigate();
  const { trackClick } = useOvhTracking();

  return (
    <div className="flex justify-between items-center">
      <OdsBadge
        label={
          status === OFFER_CREATING_STATUS
            ? tStatus('activation_in_progress')
            : tStatus('disabled')
        }
      />

      {status !== OFFER_CREATING_STATUS && !isStatusTerminated(backupStatus) && (
        <ActionMenu
          id={`action-gold-offer-${id}`}
          isCompact
          variant={ODS_BUTTON_VARIANT.ghost}
          icon={ODS_ICON_NAME.ellipsisVertical}
          items={[
            {
              'data-testid': TEST_IDS.activateGoldOfferAction,
              id: 1,
              label: tAction('activate'),
              onClick: () => {
                trackClick(TRACKING.dashboard.clicks.activateGold);
                navigate(urls.activateVeeamBackupOffer.replace(':id', id));
              },
            },
          ]}
        />
      )}
    </div>
  );
};
