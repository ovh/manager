import { useNotifications } from '@ovh-ux/manager-react-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_BUTTON_VARIANT, ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsModal,
  OsdsSpinner,
} from '@ovhcloud/ods-components/react';
import { useEffect, useState } from 'react';
import { Translation, useTranslation } from 'react-i18next';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useUsers } from '@/api/hooks/useUser';
import { TUser } from '@/api/data/user';
import StepOneComponent from './StepOne.component';
import StepTwoComponent from './StepTwo.component';
import { useAddUser } from '@/api/hooks/useObject';

export default function AddUserPage() {
  const { addSuccess, addError } = useNotifications();
  const { t } = useTranslation('pci-storages-containers-object-add-user');
  const navigate = useNavigate();
  const { projectId, storageId, objectName } = useParams();
  const decodedObjectName = objectName.replace(/~2F/g, '/');
  const [searchParams] = useSearchParams();
  const region = searchParams.get('region');
  const { data: listUsers, isPending: isPendingListUsers } = useUsers(
    projectId,
  );
  const [stepUser, setStepUser] = useState(0);
  const [selectedUser, setSelectedUser] = useState<TUser>(null);
  const [selectedRole, setSelectedRole] = useState<string>(null);
  useEffect(() => {
    if (listUsers) {
      setSelectedUser(listUsers[0]);
    }
  }, [listUsers]);
  const onCancel = () => navigate(`..`);
  const onClose = () => navigate(`..`);

  const { addUser, isPending: isPendingAddUser } = useAddUser({
    projectId,
    storageId,
    objectName: decodedObjectName,
    userId: selectedUser?.id,
    role: selectedRole,
    region,
    onError(error: ApiError) {
      addError(
        <Translation ns="pci-storages-containers-object-delete">
          {(_t) =>
            _t(
              'pci_projects_project_storages_containers_container_addUser_object_error_addUser',
              {
                value: decodedObjectName,
                message:
                  error?.response?.data?.message || error?.message || null,
              },
            )
          }
        </Translation>,
        true,
      );
      onClose();
    },
    onSuccess() {
      addSuccess(
        <Translation ns="pci-storages-containers-object-delete">
          {(_t) =>
            _t(
              'pci_projects_project_storages_containers_container_addUser_object_success_message',
              {
                value: decodedObjectName,
                name: selectedUser?.description,
                role: t(
                  `pci_projects_project_storages_containers_container_addUser_right_${selectedRole}`,
                ),
              },
            )
          }
        </Translation>,
        true,
      );
      navigate('..');
    },
  });
  const onConfirm = () => addUser();
  const isPending = isPendingListUsers || isPendingAddUser;
  return (
    <OsdsModal
      headline={t(
        'pci_projects_project_storages_containers_container_addUser_container_title',
      )}
      color={ODS_THEME_COLOR_INTENT.primary}
      onOdsModalClose={onClose}
    >
      <slot name="content">
        {isPending ? (
          <OsdsSpinner
            inline
            size={ODS_SPINNER_SIZE.md}
            className="block text-center mt-6"
            data-testid="pciModal-spinner"
          />
        ) : (
          <div className="mt-6">
            {stepUser === 0 ? (
              <StepOneComponent
                onSelectUser={setSelectedUser}
                users={listUsers}
                selectedUser={selectedUser}
              />
            ) : (
              <StepTwoComponent
                onSelectRole={setSelectedRole}
                selectedRole={selectedRole}
                objectName={decodedObjectName}
              />
            )}
          </div>
        )}
      </slot>
      {stepUser === 1 && (
        <OsdsButton
          slot="actions"
          onClick={() => setStepUser(0)}
          color={ODS_THEME_COLOR_INTENT.primary}
          variant={ODS_BUTTON_VARIANT.ghost}
        >
          {t(
            'pci_projects_project_storages_containers_container_addUser_back_label',
          )}
        </OsdsButton>
      )}

      <OsdsButton
        slot="actions"
        onClick={onCancel}
        color={ODS_THEME_COLOR_INTENT.primary}
        variant={ODS_BUTTON_VARIANT.ghost}
      >
        {t(
          'pci_projects_project_storages_containers_container_addUser_cancel_label',
        )}
      </OsdsButton>
      <OsdsButton
        slot="actions"
        onClick={() => (stepUser === 0 ? setStepUser(1) : onConfirm())}
        color={ODS_THEME_COLOR_INTENT.primary}
        disabled={(!selectedUser && stepUser === 0) || isPending || undefined}
      >
        {t(
          stepUser === 0
            ? 'pci_projects_project_storages_containers_container_addUser_next_label'
            : 'pci_projects_project_storages_containers_container_addUser_submit_label',
        )}
      </OsdsButton>
    </OsdsModal>
  );
}
