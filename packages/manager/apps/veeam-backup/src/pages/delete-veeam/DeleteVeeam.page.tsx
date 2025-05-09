import React, { useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ButtonType,
  PageLocation,
  TrackingClickParams,
  PageType,
  useOvhTracking,
  ShellContext,
} from '@ovh-ux/manager-react-shell-client';
import { DeleteModal } from '@ovh-ux/manager-react-components';
import {
  getVeeamBackupDisplayName,
  useVeeamBackup,
} from '@ovh-ux/manager-module-vcd-api';
import { useDeleteService } from '@ovh-ux/manager-module-common-api';
import { US_SUBSIDIARY } from '@/constants';

import { MessagesContext } from '@/components/Messages/Messages.context';
import { PageName } from '@/tracking.constant';

export const sharedTrackingParams: TrackingClickParams = {
  location: PageLocation.popup,
  buttonType: ButtonType.button,
};

export default function DeleteVeeamBackupModal() {
  const { id } = useParams();
  const { t } = useTranslation('delete-veeam');
  const { data, isLoading } = useVeeamBackup(id);
  const { ovhSubsidiary } = useContext(ShellContext).environment.getUser();
  const { trackClick, trackPage } = useOvhTracking();
  const { addSuccessMessage } = React.useContext(MessagesContext);
  const navigate = useNavigate();

  const onSuccess = () => {
    trackPage({
      pageType: PageType.bannerSuccess,
      pageName: PageName.successDeleteVeeamBackup,
    });
    addSuccessMessage(
      ovhSubsidiary === US_SUBSIDIARY
        ? t('terminate_veeam_backup_success_us')
        : t('terminate_veeam_backup_success', {
            name: getVeeamBackupDisplayName(data.data),
          }),
      { veeamBackupId: id },
    );
    navigate('..');
  };
  const onError = () => {
    trackPage({
      pageType: PageType.bannerError,
      pageName: PageName.errorDeleteVeeamBackup,
    });
  };

  const { terminateService, isPending, error, isError } = useDeleteService({
    onSuccess,
    onError,
  });

  const onClose = () => {
    trackClick({
      ...sharedTrackingParams,
      actionType: 'exit',
      actions: ['delete_veeam-backup', 'cancel'],
    });
    navigate('..');
  };

  const onConfirmDelete = () => {
    trackClick({
      ...sharedTrackingParams,
      actionType: 'action',
      actions: ['delete_veeam-backup', 'confirm'],
    });
    terminateService({ resourceName: id });
  };

  return (
    <DeleteModal
      isOpen
      closeModal={onClose}
      isLoading={isPending || isLoading}
      onConfirmDelete={onConfirmDelete}
      error={isError ? error?.message : null}
    />
  );
}
