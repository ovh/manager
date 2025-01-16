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
import {
  createSearchParams,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useUsers } from '@/api/hooks/useUser';
import { TUser } from '@/api/data/user';
import StepOneComponent from './StepOne.component';
import StepTwoComponent from './StepTwo.component';
import { useAddUser } from '@/api/hooks/useObject';

export default function AddUserPage() {
  const { t } = useTranslation('containers/add-user');

  const { addSuccess, addError } = useNotifications();
  const navigate = useNavigate();

  const { projectId, storageId, objectName } = useParams();
  const [searchParams] = useSearchParams();

  const decodedObjectName = objectName.replace(/~2F/g, '/');
  const region = searchParams.get('region');

  const { data: listUsers, isPending: isPendingListUsers } = useUsers(
    projectId,
  );

  const defaultUser = listUsers && listUsers[0];

  const [stepUser, setStepUser] = useState(0);
  const [selectedUser, setSelectedUser] = useState<TUser>(null);
  const [selectedRole, setSelectedRole] = useState<string>(null);

  const onClose = () =>
    navigate({
      pathname: `..`,
      search: `?${createSearchParams({
        region: searchParams.get('region'),
      })}`,
    });

  const onCancel = onClose;

  const { addUser, isPending: isPendingAddUser } = useAddUser({
    projectId,
    storageId,
    objectName: decodedObjectName,
    userId: selectedUser?.id,
    role: selectedRole,
    region,
    onError(error: ApiError) {
      addError(
        <Translation ns="containers/add-user">
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
        <Translation ns="containers/add-user">
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
      onClose();
    },
  });

  const isPending = isPendingListUsers || isPendingAddUser;

  return (
    <OdsModal onOdsClose={onClose} isOpen>
      <OdsText preset="heading-3">
        {t(
          'pci_projects_project_storages_containers_container_addUser_object_title',
        )}
      </OdsText>

      {isPending ? (
        <OdsSpinner
          size={ODS_SPINNER_SIZE.md}
          className="block text-center my-6"
        />
      ) : (
        <div className="my-6">
          {stepUser === 0 ? (
            <StepOneComponent
              onSelectUser={setSelectedUser}
              users={listUsers}
              defaultUser={defaultUser}
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

      {stepUser === 1 && (
        <OdsButton
          slot="actions"
          onClick={() => setStepUser(0)}
          variant={ODS_BUTTON_VARIANT.outline}
          label={t(
            'pci_projects_project_storages_containers_container_addUser_back_label',
          )}
        />
      )}
      <OdsButton
        slot="actions"
        onClick={onCancel}
        variant={ODS_BUTTON_VARIANT.outline}
        label={t(
          'pci_projects_project_storages_containers_container_addUser_cancel_label',
        )}
      />
      <OdsButton
        slot="actions"
        onClick={() => (stepUser === 0 ? setStepUser(1) : addUser())}
        isDisabled={
          (!selectedUser && stepUser === 0) ||
          (!selectedRole && stepUser === 1) ||
          isPending ||
          undefined
        }
        label={t(
          stepUser === 0
            ? 'pci_projects_project_storages_containers_container_addUser_next_label'
            : 'pci_projects_project_storages_containers_container_addUser_submit_label',
        )}
      />
    </OdsModal>
  );
}
