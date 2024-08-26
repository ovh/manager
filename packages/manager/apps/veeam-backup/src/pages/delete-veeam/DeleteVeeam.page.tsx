import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ButtonType,
  PageLocation,
  TrackingClickParams,
  PageType,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { DeleteServiceModal } from '@ovhcloud/manager-components';
import { MessagesContext } from '@/components/Messages/Messages.context';
import { getVeeamBackupDisplayName, useVeeamBackup } from '@/data';
import { PageName } from '@/tracking.constant';

export const sharedTrackingParams: TrackingClickParams = {
  location: PageLocation.popup,
  buttonType: ButtonType.button,
};

export default function DeleteVeeamBackupModal() {
  const { id } = useParams();
  const { t } = useTranslation('delete-veeam');
  const { data, isLoading } = useVeeamBackup(id);
  const { trackClick, trackPage } = useOvhTracking();
  const { addSuccessMessage } = React.useContext(MessagesContext);
  const navigate = useNavigate();

  const onClose = () => {
    trackClick({
      ...sharedTrackingParams,
      actionType: 'exit',
      actions: ['delete_veeam-backup', 'cancel'],
    });
    navigate('..');
  };

  return (
    <DeleteServiceModal
      closeModal={onClose}
      deleteInputLabel={t('delete_input_label')}
      headline={t('headline')}
      resourceName={id}
      isLoading={isLoading}
      onSuccess={() => {
        trackPage({
          pageType: PageType.bannerSuccess,
          pageName: PageName.successDeleteVeeamBackup,
        });
        addSuccessMessage(
          t('terminate_veeam_backup_success', {
            name: getVeeamBackupDisplayName(data.data),
          }),
          { veeamBackupId: id },
        );
        navigate('..');
      }}
      onError={() => {
        trackPage({
          pageType: PageType.bannerError,
          pageName: PageName.errorDeleteVeeamBackup,
        });
      }}
      onConfirmDelete={() => {
        trackClick({
          ...sharedTrackingParams,
          actionType: 'action',
          actions: ['delete_veeam-backup', 'confirm'],
        });
      }}
    />
  );
}
