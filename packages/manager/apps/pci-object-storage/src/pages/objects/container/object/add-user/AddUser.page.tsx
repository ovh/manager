import {
  OdsButton,
  OdsModal,
  OdsSpinner,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { ODS_BUTTON_VARIANT, ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
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
    <OdsModal onOdsClose={onClose}>
      <OdsText preset="heading-3">{}</OdsText>
      headline=
      {t(
        'pci_projects_project_storages_containers_container_addUser_container_title',
      )}
      <slot name="content">
        {isPending ? (
          <OdsSpinner
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
        <OdsButton
          slot="actions"
          onClick={() => setStepUser(0)}
          variant={ODS_BUTTON_VARIANT.ghost}
          label={t(
            'pci_projects_project_storages_containers_container_addUser_back_label',
          )}
        />
      )}
      <OdsButton
        slot="actions"
        onClick={onCancel}
        variant={ODS_BUTTON_VARIANT.ghost}
        label={t(
          'pci_projects_project_storages_containers_container_addUser_cancel_label',
        )}
      />
      <OdsButton
        slot="actions"
        onClick={() => (stepUser === 0 ? setStepUser(1) : onConfirm())}
        isDisabled={(!selectedUser && stepUser === 0) || isPending || undefined}
        label={t(
          stepUser === 0
            ? 'pci_projects_project_storages_containers_container_addUser_next_label'
            : 'pci_projects_project_storages_containers_container_addUser_submit_label',
        )}
      />
    </OdsModal>
  );
}
