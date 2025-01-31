import {
  OdsButton,
  OdsModal,
  OdsSpinner,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { ODS_BUTTON_VARIANT, ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import { useContext, useState } from 'react';
import { Translation, useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { ApiError } from '@ovh-ux/manager-core-api';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useProductRegionsAvailability } from '@ovh-ux/manager-pci-common';
import StepOneComponent from './StepOne.component';
import StepTwoComponent from './StepTwo.component';
import { useUsers } from '@/api/hooks/useUser';
import { TUser } from '@/api/data/user';
import { useAddUser } from '@/api/hooks/useArchive';
import { COLD_ARCHIVE_TRACKING } from '@/constants';

// TODO Refactor with object storage when object storage is prodded because the code is duplicated
export default function AddUserToContainerPage() {
  const { t } = useTranslation('cold-archive/add-user');

  const [stepUser, setStepUser] = useState(0);
  const [selectedUser, setSelectedUser] = useState<TUser>(null);
  const [selectedRole, setSelectedRole] = useState<string>(null);

  const { addSuccess, addError } = useNotifications();
  const navigate = useNavigate();

  const { projectId, archiveName } = useParams();
  const { tracking } = useContext(ShellContext).shell;

  const { ovhSubsidiary } = useContext(ShellContext).environment.getUser();
  const {
    data: regions,
    isPending: isRegionsPending,
  } = useProductRegionsAvailability(
    ovhSubsidiary,
    'coldarchive.archive.hour.consumption',
  );

  const { validUsersWithCredentials, isPending: isPendingListUsers } = useUsers(
    projectId,
  );

  const defaultUser = validUsersWithCredentials?.[0];

  const trackAddUserModalClick = (action: string) => {
    tracking?.trackClick({
      name: `${COLD_ARCHIVE_TRACKING.CONTAINERS.MAIN}::${COLD_ARCHIVE_TRACKING.CONTAINERS.ADD_USER}::${action}`,
      type: 'action',
    });
  };

  const trackAddUserModalPage = (action: string) => {
    tracking?.trackClick({
      name: `${COLD_ARCHIVE_TRACKING.CONTAINERS.MAIN}::${COLD_ARCHIVE_TRACKING.CONTAINERS.ADD_USER}_${action}`,
      type: 'navigation',
    });
  };

  const onCancel = () => {
    trackAddUserModalClick(COLD_ARCHIVE_TRACKING.ACTIONS.CANCEL);
    navigate(`..`);
  };
  const onClose = () => onCancel();

  const { addUser, isPending: isPendingAddUser } = useAddUser({
    projectId,
    storageId: archiveName,
    userId: selectedUser?.id,
    role: selectedRole,
    region: regions ? regions[0] : '',
    onError: (error: ApiError) => {
      addError(
        <Translation ns="cold-archive/add-user">
          {(_t) =>
            _t(
              'pci_projects_project_storages_coldArchive_containers_addUser_error_addUser',
              {
                value: archiveName,
                message:
                  error?.response?.data?.message || error?.message || null,
              },
            )
          }
        </Translation>,
        true,
      );
      trackAddUserModalPage(COLD_ARCHIVE_TRACKING.STATUS.ERROR);
      navigate('..');
    },
    onSuccess: () => {
      addSuccess(
        <Translation ns="cold-archive/add-user">
          {(_t) =>
            _t(
              'pci_projects_project_storages_coldArchive_containers_addUser_success_message',
              {
                value: archiveName,
                name: selectedUser?.description,
                role: t(
                  `pci_projects_project_storages_coldArchive_containers_addUser_right_${selectedRole}`,
                ),
              },
            )
          }
        </Translation>,
        true,
      );
      trackAddUserModalPage(COLD_ARCHIVE_TRACKING.STATUS.SUCCESS);
      navigate(`..`);
    },
  });

  const onConfirm = () => {
    if (stepUser === 0) {
      setStepUser(1);
    } else {
      trackAddUserModalClick(COLD_ARCHIVE_TRACKING.ACTIONS.CONFIRM);
      addUser();
    }
  };

  const isPending = isPendingListUsers || isPendingAddUser || isRegionsPending;

  return (
    <OdsModal onOdsClose={onClose} isOpen className="modal_add-user">
      <OdsText preset="heading-3">
        {t(
          'pci_projects_project_storages_coldArchive_containers_addUser_container_title',
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
              containerId={archiveName}
            />
          )}
        </div>
      )}

      {stepUser === 1 && (
        <OdsButton
          slot="actions"
          onClick={() => setStepUser(0)}
          isDisabled={isPending}
          variant={ODS_BUTTON_VARIANT.outline}
          label={t(
            'pci_projects_project_storages_coldArchive_containers_addUser_back_label',
          )}
        />
      )}

      <OdsButton
        slot="actions"
        onClick={onCancel}
        isDisabled={isPending}
        variant={ODS_BUTTON_VARIANT.outline}
        label={t(
          'pci_projects_project_storages_coldArchive_containers_addUser_cancel_label',
        )}
      />
      <OdsButton
        slot="actions"
        onClick={onConfirm}
        isDisabled={
          (!selectedUser && stepUser === 0) ||
          (!selectedRole && stepUser === 1) ||
          isPending ||
          undefined
        }
        label={t(
          stepUser === 0
            ? 'pci_projects_project_storages_coldArchive_containers_addUser_next_label'
            : 'pci_projects_project_storages_coldArchive_containers_addUser_submit_label',
        )}
      />
    </OdsModal>
  );
}
