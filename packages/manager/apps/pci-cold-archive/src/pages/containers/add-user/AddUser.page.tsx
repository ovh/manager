import { ApiError } from '@ovh-ux/manager-core-api';
import { ODS_BUTTON_VARIANT, ODS_SPINNER_SIZE } from '@ovhcloud/ods-components';
import {
  OdsButton,
  OdsModal,
  OdsSpinner,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { TUser } from '@/api/data/users';
import { useAddUser } from '@/api/hooks/useArchive';
import { useUsers } from '@/api/hooks/useUsers';
import {
  OBJECT_CONTAINER_USER_ROLE_ADMIN,
  OBJECT_CONTAINER_USER_ROLES,
} from '@/constants';
import { useNotifications } from '@/hooks/useNotifications';
import { useTracking } from '@/hooks/useTracking';
import { COLD_ARCHIVE_TRACKING } from '@/tracking.constants';
import StepOneComponent from './StepOne.component';
import StepTwoComponent from './StepTwo.component';

type TRole = typeof OBJECT_CONTAINER_USER_ROLES[number];

export default function AddUserToContainerPage() {
  const { t } = useTranslation('containers/add-user');

  const [stepUser, setStepUser] = useState(0);
  const [selectedUser, setSelectedUser] = useState<TUser>(null);
  const [selectedRole, setSelectedRole] = useState<TRole>(
    OBJECT_CONTAINER_USER_ROLE_ADMIN,
  );

  const { addSuccessMessage, addErrorMessage } = useNotifications({
    ns: 'containers/add-user',
  });

  const navigate = useNavigate();
  const goBack = () => navigate('..');

  const { projectId, archiveName } = useParams();

  const { validUsersWithCredentials, isPending: isUsersPending } = useUsers(
    projectId,
  );

  const defaultUser = validUsersWithCredentials?.[0];

  const modalRef = useRef(undefined);

  const {
    trackConfirmAction,
    trackCancelAction,
    trackSuccessPage,
    trackErrorPage,
  } = useTracking(
    `${COLD_ARCHIVE_TRACKING.CONTAINERS.MAIN}::${COLD_ARCHIVE_TRACKING.CONTAINERS.ADD_USER}`,
  );

  const onCancel = () => {
    trackCancelAction();
    goBack();
  };

  const onClose = onCancel;

  const { addUser, isPending: isPendingAddUser } = useAddUser({
    projectId,
    storageId: archiveName,
    userId: selectedUser?.id,
    role: selectedRole,
    onError: (error: ApiError) => {
      addErrorMessage({
        i18nKey:
          'pci_projects_project_storages_coldArchive_containers_addUser_error_addUser',
        error,
        values: {
          value: archiveName,
        },
      });

      trackErrorPage();
      goBack();
    },
    onSuccess: () => {
      addSuccessMessage({
        i18nKey:
          'pci_projects_project_storages_coldArchive_containers_addUser_success_message',
        values: {
          value: archiveName,
          name: selectedUser?.description,
          role: t(
            `pci_projects_project_storages_coldArchive_containers_addUser_right_${selectedRole}`,
          ),
        },
      });

      trackSuccessPage();
      goBack();
    },
  });

  const onConfirm = () => {
    if (stepUser === 0) {
      setStepUser(1);
    } else {
      trackConfirmAction();
      addUser();
    }
  };

  const isPending = isUsersPending || isPendingAddUser;

  /* The following useEffect is a hack to allow the OdsSelect overflowing
   * in the OdsModal thus allowing the user to select an item even for long lists.
   * This hack can be removed once this issue is fixed on ods side, and this
   * version of ods is available in pci-common & manager-react-components.
   */
  useEffect(() => {
    if (!modalRef.current) return;
    const { shadowRoot } = modalRef.current;
    if (!shadowRoot.querySelector('style')) {
      const style = document.createElement('style');
      style.innerHTML = `
        .ods-modal__dialog { overflow: visible !important; }
        .ods-modal__dialog__content { overflow: visible !important; }
      `;
      shadowRoot.appendChild(style);
    }
  }, [modalRef.current]);

  return (
    <OdsModal onOdsClose={onClose} isOpen ref={modalRef}>
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
