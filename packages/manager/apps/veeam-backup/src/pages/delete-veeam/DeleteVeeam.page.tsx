import React, { useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  PageType,
  useOvhTracking,
  ShellContext,
} from '@ovh-ux/manager-react-shell-client';
import { DeleteModal } from '@ovh-ux/manager-react-components';
import { useDeleteService } from '@ovh-ux/manager-module-common-api';
import { US_SUBSIDIARY } from '@/constants';

import { MessagesContext } from '@/components/Messages/Messages.context';
import { PageName, TRACKING } from '@/tracking.constant';

export default function DeleteVeeamBackupModal() {
  const { id } = useParams();
  const { t } = useTranslation('delete-veeam');
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
      t(
        ovhSubsidiary === US_SUBSIDIARY
          ? 'terminate_veeam_backup_success_us'
          : 'terminate_veeam_backup_success',
        { serviceName: id },
      ),
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
    trackClick(TRACKING.deleteVeeam.clicks.closeModal);
    navigate('..');
  };

  const onConfirmDelete = () => {
    trackClick(TRACKING.deleteVeeam.clicks.confirmDelete);
    terminateService({ resourceName: id });
  };

  return (
    <DeleteModal
      isOpen
      closeModal={onClose}
      isLoading={isPending}
      onConfirmDelete={onConfirmDelete}
      error={isError ? error?.message : null}
    />
  );
}
