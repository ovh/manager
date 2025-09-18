import { OsdsModal, OsdsSpinner } from '@ovhcloud/ods-components/react';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { Translation, useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { useDeleteVolume, useVolume } from '@/api/hooks/useVolume';
import DeleteWarningMessage from './DeleteWarningMessage';
import DeleteConstraintWarningMessage from './DeleteConstraintWarningMessage';
import { ButtonLink } from '@/components/button-link/ButtonLink';
import { useTrackBanner } from '@/hooks/useTrackBanner';
import { Button } from '@/components/button/Button';
import { useVolumeSnapshots } from '@/api/hooks/useSnapshot';

export default function DeleteStorage() {
  const { projectId, volumeId } = useParams();
  const { t } = useTranslation('delete');
  const navigate = useNavigate();

  const onClose = () => navigate('..');
  const { addError, addSuccess } = useNotifications();
  const { data: volume, isPending: isVolumePending } = useVolume(
    projectId,
    volumeId,
  );
  const { data: snapshots, isPending: isSnapshotPending } = useVolumeSnapshots(
    projectId,
    volumeId,
  );

  const onTrackingBannerError = useTrackBanner(
    { type: 'error' },
    (err: Error) => {
      addError(
        <Translation ns="delete">
          {(_t) =>
            _t(
              'pci_projects_project_storages_blocks_block_delete_error_delete',
              {
                volume: volume?.name,
                message: err?.message,
              },
            )
          }
        </Translation>,
        true,
      );
      onClose();
    },
  );

  const onTrackingBannerSuccess = useTrackBanner({ type: 'success' }, () => {
    addSuccess(
      <Translation ns="delete">
        {(_t) =>
          _t(
            'pci_projects_project_storages_blocks_block_delete_success_message',
            {
              volume: volume?.name,
            },
          )
        }
      </Translation>,
      true,
    );
    onClose();
  });

  const { deleteVolume, isPending: isDeletePending } = useDeleteVolume({
    projectId,
    volumeId,
    onError: onTrackingBannerError,
    onSuccess: onTrackingBannerSuccess,
  });

  const isPending = isVolumePending || isSnapshotPending || isDeletePending;
  const hasSnapshot = !isPending && snapshots?.length > 0;
  const isAttached = !isPending && volume?.attachedTo.length > 0;
  const canDelete = !isPending && !isAttached && !hasSnapshot;

  const actionValues = [volume?.region];

  return (
    <OsdsModal
      headline={t('pci_projects_project_storages_blocks_block_delete_title')}
      onOdsModalClose={onClose}
      color={ODS_THEME_COLOR_INTENT.warning}
    >
      <slot name="content">
        {isPending ? (
          <OsdsSpinner
            inline
            size={ODS_SPINNER_SIZE.md}
            className="block text-center"
            data-testid="deleteStorage-spinner"
          />
        ) : (
          <>
            <DeleteConstraintWarningMessage
              hasSnapshot={hasSnapshot}
              isAttached={isAttached}
            />
            {canDelete && (
              <>
                {t(
                  'pci_projects_project_storages_blocks_block_delete_content',
                  {
                    volume: volume?.name,
                  },
                )}
                <DeleteWarningMessage />
              </>
            )}
          </>
        )}
      </slot>
      <ButtonLink
        slot="actions"
        color="primary"
        variant="ghost"
        to=".."
        actionName="cancel"
        actionValues={actionValues}
      >
        {t('pci_projects_project_storages_blocks_block_delete_cancel_label')}
      </ButtonLink>
      <Button
        slot="actions"
        color="primary"
        onClick={deleteVolume}
        disabled={!canDelete}
        actionName="confirm"
        actionValues={actionValues}
      >
        {t('pci_projects_project_storages_blocks_block_delete_submit_label')}
      </Button>
    </OsdsModal>
  );
}
