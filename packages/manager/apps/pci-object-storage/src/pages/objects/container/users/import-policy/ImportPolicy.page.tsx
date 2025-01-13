import { PciModal } from '@ovh-ux/manager-pci-common';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { Translation, useTranslation } from 'react-i18next';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ApiError } from '@ovh-ux/manager-core-api';
import { OdsFormField, OdsText } from '@ovhcloud/ods-components/react';
import FileInputComponent from '@/components/FileInput.component';
import { useImportPolicy, useUsers } from '@/api/hooks/useUser';
import { TUser } from '@/api/data/user';

export default function ImportPolicyPage() {
  const { addSuccess, addError } = useNotifications();
  const { projectId } = useParams();
  const [searchParams] = useSearchParams();
  const userId = searchParams.get('userId');
  const [user, setUser] = useState<TUser>(undefined);
  const {
    validUsersWithCredentials: listUsers,
    isPending: isPendingUsers,
  } = useUsers(projectId);
  const { t } = useTranslation('objects/users/import-policy');
  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
  const navigate = useNavigate();

  const onCancel = () => navigate(`..`);
  const onClose = () => navigate(`..`);

  const { importPolicy, isPending: isPendingImport } = useImportPolicy({
    projectId,
    userId,
    files: filesToUpload,
    onError(error: ApiError) {
      addError(
        <Translation ns="objects/users/import-policy">
          {(_t) =>
            _t('pci_projects_project_storages_containers_users_import_error', {
              message: error?.response?.data?.message || error?.message || null,
              username: 'username',
            })
          }
        </Translation>,
        true,
      );
      onClose();
    },
    onSuccess() {
      addSuccess(
        <Translation ns="objects/users/import-policy">
          {(_t) =>
            _t(
              'pci_projects_project_storages_containers_users_import_success',
              {
                username: user.username,
              },
            )
          }
        </Translation>,
        true,
      );
      onClose();
    },
  });

  const onConfirm = () => {
    importPolicy();
  };

  useEffect(() => {
    if (listUsers) {
      setUser(listUsers.find((u) => `${u.id}` === userId));
    }
  }, [listUsers]);

  const isPending = isPendingUsers || isPendingImport;

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
      isDisabled={filesToUpload.length === 0 || isPending}
    >
      <OdsText preset="paragraph">
        {t('pci_projects_project_storages_containers_users_import_description')}
      </OdsText>

      <OdsFormField className="w-full my-4">
        <FileInputComponent
          dropzoneLabel={t(
            'pci_projects_project_storages_containers_users_import_add_files_label',
          )}
          onFilesSelected={setFilesToUpload}
        />
      </OdsFormField>
    </PciModal>
  );
}
