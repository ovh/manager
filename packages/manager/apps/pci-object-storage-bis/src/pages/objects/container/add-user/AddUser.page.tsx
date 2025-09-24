import {
  OdsButton,
  OdsModal,
  OdsSpinner,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { ODS_BUTTON_VARIANT, ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { useRef, useState } from 'react';
import { Translation, useTranslation } from 'react-i18next';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useUsers } from '@/api/hooks/useUser';
import { TUser } from '@/api/data/user';
import StepOneComponent from './StepOne.component';
import StepTwoComponent from './StepTwo.component';
import { useAddUser, useAllStorages } from '@/api/hooks/useStorages';
import { useOdsModalOverflowHack } from '@/hooks/useOdsModalOverflowHack';

export default function AddUserToContainerPage() {
  const { t } = useTranslation('containers/add-user');

  const [stepUser, setStepUser] = useState(0);
  const [selectedUser, setSelectedUser] = useState<TUser>(null);
  const [selectedRole, setSelectedRole] = useState<string>(null);

  const { addSuccess, addError } = useNotifications();
  const navigate = useNavigate();

  const { projectId } = useParams();
  const [searchPrams] = useSearchParams();
  const containerId = searchPrams.get('containerId');

  const modalRef = useRef<HTMLOdsModalElement>(undefined);

  const { data: storages, isPending: isStoragesPending } = useAllStorages(
    projectId,
  );

  const storageDetail = storages?.resources.find((s) => s.name === containerId);

  const { validUsersWithCredentials, isPending: isPendingListUsers } = useUsers(
    projectId,
  );

  const defaultUser = validUsersWithCredentials?.[0];

  const onCancel = () => navigate(`..`);
  const onClose = () => navigate(`..`);

  const { addUser, isPending: isPendingAddUser } = useAddUser({
    projectId,
    storageId: containerId,
    userId: selectedUser?.id,
    role: selectedRole,
    region: storageDetail?.region,
    onError: (error: ApiError) => {
      addError(
        <Translation ns="containers/add-user">
          {(_t) =>
            _t(
              'pci_projects_project_storages_containers_container_addUser_error_addUser',
              {
                value: containerId,
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
    onSuccess: () => {
      addSuccess(
        <Translation ns="containers/add-user">
          {(_t) =>
            _t(
              'pci_projects_project_storages_containers_container_addUser_success_message',
              {
                value: containerId,
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

  // @TODO refactor when ods modal overflow is fixed
  useOdsModalOverflowHack(modalRef);

  const isPending = isPendingListUsers || isPendingAddUser || isStoragesPending;

  return (
    <OdsModal onOdsClose={onClose} ref={modalRef} isOpen>
      <OdsText preset="heading-3">
        {t(
          'pci_projects_project_storages_containers_container_addUser_container_title',
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
              users={validUsersWithCredentials}
              defaultUser={defaultUser}
              selectedUser={selectedUser}
            />
          ) : (
            <StepTwoComponent
              onSelectRole={setSelectedRole}
              selectedRole={selectedRole}
              containerId={containerId}
            />
          )}
        </div>
      )}

      {stepUser === 1 && (
        <OdsButton
          slot="actions"
          onClick={() => setStepUser(0)}
          isDisabled={isPendingAddUser}
          variant={ODS_BUTTON_VARIANT.outline}
          label={t(
            'pci_projects_project_storages_containers_container_addUser_back_label',
          )}
        />
      )}

      <OdsButton
        slot="actions"
        onClick={onCancel}
        isDisabled={isPendingAddUser}
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
