import {
  OsdsButton,
  OsdsModal,
  OsdsSpinner,
} from '@ovhcloud/ods-components/react';
import { ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { Translation, useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useNotifications } from '@ovh-ux/manager-react-components';
import {
  ButtonType,
  PageType,
  useOvhTracking,
  usePageTracking,
} from '@ovh-ux/manager-react-shell-client';
import {
  useDeleteVolume,
  useVolume,
  useVolumeSnapshot,
} from '@/api/hooks/useVolume';
import DeleteWarningMessage from './DeleteWarningMessage';
import DeleteConstraintWarningMessage from './DeleteConstraintWarningMessage';
import { ButtonLink } from '@/components/button-link/ButtonLink';

export default function DeleteStorage() {
  const { projectId, volumeId } = useParams();
  const { t } = useTranslation('delete');
  const navigate = useNavigate();
  const { trackClick, trackPage } = useOvhTracking();
  const pageTracking = usePageTracking();

  const onClose = () => navigate('..');
  const { addError, addSuccess } = useNotifications();
  const { data: volume, isPending: isVolumePending } = useVolume(
    projectId,
    volumeId,
  );
  const { data: snapshots, isPending: isSnapshotPending } = useVolumeSnapshot(
    projectId,
  );
  const { deleteVolume, isPending: isDeletePending } = useDeleteVolume({
    projectId,
    volumeId,
    onError(err: Error) {
      trackPage({
        pageType: PageType.bannerError,
        pageName: pageTracking.pageName,
      });

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
    onSuccess() {
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: pageTracking.pageName,
      });

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
    },
  });

  const isPending = isVolumePending || isSnapshotPending || isDeletePending;
  const hasSnapshot =
    !isPending && snapshots?.some((s) => s.volumeId === volumeId);
  const isAttached = !isPending && volume?.attachedTo.length > 0;
  const canDelete = !isPending && !isAttached && !hasSnapshot;

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
        trackingName="cancel"
        trackingParams={[volume?.region]}
      >
        {t('pci_projects_project_storages_blocks_block_delete_cancel_label')}
      </ButtonLink>
      <OsdsButton
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        onClick={() => {
          if (canDelete) {
            trackClick({
              buttonType: ButtonType.button,
              actions: ['confirm', volume?.region],
            });

            deleteVolume();
          }
        }}
        {...(canDelete ? {} : { disabled: true })}
      >
        {t('pci_projects_project_storages_blocks_block_delete_submit_label')}
      </OsdsButton>
    </OsdsModal>
  );
}
