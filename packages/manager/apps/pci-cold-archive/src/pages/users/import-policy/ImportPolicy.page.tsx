import { ApiError } from '@ovh-ux/manager-core-api';
import { PciModal } from '@ovh-ux/manager-pci-common';
import { OdsFormField, OdsText } from '@ovhcloud/ods-components/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { COLD_ARCHIVE_TRACKING } from '@/tracking.constants';
import { useTracking } from '@/hooks/useTracking';
import { useNotifications } from '@/hooks/useNotifications';
import FileInputComponent from '@/components/FileInput.component';
import { useUser, useImportPolicy } from '@/api/hooks/useUsers';

export default function ImportPolicyPage() {
  const { t } = useTranslation('users/import-policy');

  const { addSuccessMessage, addErrorMessage } = useNotifications({
    ns: 'users/import-policy',
  });

  const { projectId } = useParams();

  const [searchParams] = useSearchParams();
  const userId = Number(searchParams.get('userId'));

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const {
    trackConfirmAction,
    trackCancelAction,
    trackSuccessPage,
    trackErrorPage,
  } = useTracking(
    `${COLD_ARCHIVE_TRACKING.USER.MAIN}::${COLD_ARCHIVE_TRACKING.USER.ACTIONS.IMPORT_POLICY}`,
  );

  const navigate = useNavigate();
  const goBack = () => navigate('..');

  const onCancel = () => {
    trackCancelAction();
    goBack();
  };
  const onClose = onCancel;

  const { data: user, isPending: isUserPending } = useUser(projectId, userId);

  const { importPolicy, isPending: isImportPending } = useImportPolicy({
    projectId,
    userId,
    files: selectedFiles,
    onError: (error: ApiError) => {
      addErrorMessage({
        i18nKey: 'pci_projects_project_storages_containers_users_import_error',
        error,
        values: { username: user?.username },
      });

      trackErrorPage();
      goBack();
    },
    onSuccess: () => {
      addSuccessMessage({
        i18nKey:
          'pci_projects_project_storages_containers_users_import_success',
        values: { username: user?.username },
      });

      trackSuccessPage();
      goBack();
    },
  });

  const onConfirm = () => {
    trackConfirmAction();
    importPolicy();
  };

  const isPending = isUserPending || isImportPending;

  return (
    <PciModal
      title={t('pci_projects_project_storages_containers_users_import_title')}
      onCancel={onCancel}
      onClose={onClose}
      onConfirm={onConfirm}
      isPending={isPending}
      submitText={t(
        'pci_projects_project_storages_containers_users_import_submit_label',
      )}
      isDisabled={selectedFiles.length === 0 || isPending}
    >
      <OdsText preset="paragraph">
        {t('pci_projects_project_storages_containers_users_import_description')}
      </OdsText>

      <OdsFormField className="w-full my-4">
        <FileInputComponent
          dropzoneLabel={t(
            'pci_projects_project_storages_containers_users_import_add_files_label',
          )}
          selectedFiles={selectedFiles}
          setSelectedFiles={setSelectedFiles}
        />
      </OdsFormField>
    </PciModal>
  );
}
