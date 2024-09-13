import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  ButtonType,
  PageLocation,
  PageType,
  TrackingClickParams,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';
import { UpdateIamNameModal } from '@ovh-ux/manager-react-components';
import { useQueryClient } from '@tanstack/react-query';
import {
  veeamBackupListQueryKey,
  veeamBackupQueryKey,
  useVeeamBackup,
} from '@/data';
import { PageName } from '@/tracking.constant';
import { MessagesContext } from '@/components/Messages/Messages.context';

const sharedTrackingParams: TrackingClickParams = {
  location: PageLocation.popup,
  buttonType: ButtonType.button,
};

export default function EditVeeamBackupDisplayNameModal() {
  const { id } = useParams();
  const { addSuccessMessage } = React.useContext(MessagesContext);
  const { t } = useTranslation('veeam-backup');
  const { trackClick, trackPage } = useOvhTracking();
  const navigate = useNavigate();
  const { data, isLoading } = useVeeamBackup(id);
  const queryClient = useQueryClient();

  const onClose = () => {
    trackClick({
      ...sharedTrackingParams,
      actionType: 'exit',
      actions: ['edit_veeam-backup', 'cancel'],
    });
    navigate('..');
  };

  return (
    <UpdateIamNameModal
      closeModal={onClose}
      headline={t('update_display_name_modal_headline', { id })}
      inputLabel={t('update_display_name_input_label')}
      description={t('update_display_name_description')}
      resourceName={id}
      isLoading={isLoading}
      pattern="^(\S| ){0,32}$"
      patternMessage={t('update_display_name_pattern_message')}
      onSuccess={() => {
        trackPage({
          pageType: PageType.bannerSuccess,
          pageName: PageName.successUpdateVeeamBackup,
        });
        navigate('..');
        addSuccessMessage(t('update_veeam_backup_display_name_success'), {
          veeamBackupId: id,
        });
        setTimeout(() => {
          queryClient.invalidateQueries({
            queryKey: veeamBackupListQueryKey,
          });
          queryClient.invalidateQueries({
            queryKey: veeamBackupQueryKey(id),
          });
        }, 2000);
      }}
      onError={() => {
        trackPage({
          pageType: PageType.bannerError,
          pageName: PageName.errorUpdateVeeamBackup,
        });
      }}
      onConfirm={() => {
        trackClick({
          ...sharedTrackingParams,
          actionType: 'action',
          actions: ['edit_veeam-backup', 'confirm'],
        });
      }}
      defaultValue={data?.data?.iam?.displayName}
    />
  );
}
