import { ApiError } from '@ovh-ux/manager-core-api';
import { PciModal } from '@ovh-ux/manager-pci-common';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { OdsFormField, OdsText } from '@ovhcloud/ods-components/react';
import { useState } from 'react';
import { Translation, useTranslation } from 'react-i18next';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import FileInputComponent from '@/components/FileInput.component';
import { useGetUser, useImportPolicy } from '@/api/hooks/useUsers';

export default function ImportPolicyPage() {
  const { t } = useTranslation('users/import-policy');

  const { addSuccess, addError } = useNotifications();

  const { projectId } = useParams();

  const [searchParams] = useSearchParams();
  const userId = searchParams.get('userId');

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const navigate = useNavigate();
  const goBack = () => navigate('..');

  const onCancel = goBack;
  const onClose = goBack;

  const { user, isPending: isUserPending } = useGetUser(
    projectId,
    Number(userId),
  );

  const { importPolicy, isPending: isImportPending } = useImportPolicy({
    projectId,
    userId,
    files: selectedFiles,
    onError(error: ApiError) {
      addError(
        <Translation ns="users/import-policy">
          {(_t) =>
            _t('pci_projects_project_storages_containers_users_import_error', {
              message: error?.response?.data?.message || error?.message || null,
              username: user?.username,
            })
          }
        </Translation>,
        true,
      );
      onClose();
    },
    onSuccess() {
      addSuccess(
        <Translation ns="users/import-policy">
          {(_t) =>
            _t(
              'pci_projects_project_storages_containers_users_import_success',
              {
                username: user?.username,
              },
            )
          }
        </Translation>,
        true,
      );
      onClose();
    },
  });

  const onConfirm = importPolicy;

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
