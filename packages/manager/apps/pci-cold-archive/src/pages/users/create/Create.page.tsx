import { PciModal } from '@ovh-ux/manager-pci-common';
import { useNotifications } from '@ovh-ux/manager-react-components';
import {
  OdsFormField,
  OdsInput,
  OdsRadio,
  OdsSelect,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import {
  createUser,
  generateS3Credentials,
  getUser,
  TUser,
} from '@/api/data/users';
import { invalidateGetUsersCache, useUsers } from '@/api/hooks/useUsers';
import LabelComponent from '@/components/Label.component';
import UserInformationTile from '@/components/UserInformationTile.component';
import { COLD_ARCHIVE_TRACKING } from '@/tracking.constants';
import { poll } from '@/helpers';
import { useTracking } from '@/hooks/useTracking';

const RadioOption = ({ checked, value, label, onChange, name }) => (
  <div className="flex items-center my-2">
    <OdsRadio
      isChecked={checked}
      value={value}
      name={name}
      inputId={name}
      className="mr-4"
      onOdsChange={onChange}
    />
    <label htmlFor={name}>
      <OdsText preset="span">{label}</OdsText>
    </label>
  </div>
);

type TState = {
  userType?: 'NEW' | 'EXISTING';
  selectedUserId?: number;
  userDescription: {
    value: string;
    isTouched: boolean;
  };
  isLoading: boolean;
};

export default function UserCreatePage(): JSX.Element {
  const { t } = useTranslation(['users/create', 'users/credentials']);

  const { projectId } = useParams();

  const { trackActionClick, trackCancelAction, trackErrorPage } = useTracking(
    COLD_ARCHIVE_TRACKING.USER.ADD_USER,
  );

  const navigate = useNavigate();
  const goBack = () => navigate('..');

  const onCancel = () => {
    trackCancelAction();
    goBack();
  };

  const onClose = onCancel;

  const { addSuccess, addError } = useNotifications();

  const [state, setState] = useState<TState>({
    userDescription: {
      value: '',
      isTouched: false,
    },
    isLoading: false,
  });

  const { validUsersWithoutCredentials } = useUsers(projectId);

  const onSuccess = ({
    username,
    description,
    access,
    secret,
  }: {
    username: string;
    description: string;
    access: string;
    secret: string;
  }) => {
    addSuccess(
      <UserInformationTile
        title={
          <OdsText preset="paragraph">
            <span
              dangerouslySetInnerHTML={{
                __html: t(
                  'users/credentials:pci_projects_project_storages_containers_add_linked_user_success_message',
                  {
                    username: `<strong>${username}</strong>`,
                  },
                ),
              }}
            />
          </OdsText>
        }
        username={username}
        description={description}
        accessKey={access}
        secret={secret}
      />,
      false,
    );

    invalidateGetUsersCache(projectId);
    goBack();
  };

  const addNewUser = async () => {
    try {
      const newUser = await createUser(projectId, state.userDescription.value);

      poll<TUser>({
        fn: () => getUser(projectId, newUser.id),
        ruleFn: (user: TUser) => user.status === 'ok',
        onSuccess: ({ value }) => {
          generateS3Credentials(projectId, value.id)
            .then((credentials) => {
              setState({ ...state, isLoading: false });
              onSuccess({
                username: value.username,
                description: value.description,
                access: credentials.access,
                secret: credentials.secret,
              });
            })
            .catch(() => {
              addError(
                t('pci_projects_project_users_add_error_message', {
                  user: value.description,
                }),
              );
              setState({ ...state, isLoading: false });
              trackErrorPage();
              goBack();
            });
        },
        onFail: () => {
          addError(
            t('pci_projects_project_users_add_error_message', {
              user: newUser.description,
            }),
          );
          setState({ ...state, isLoading: false });
          trackErrorPage();
          goBack();
        },
      });
    } catch (e) {
      addError(t('pci_projects_project_users_add_error_message'));
      setState({ ...state, isLoading: false });
      trackErrorPage();
      goBack();
    }
  };

  const addExistingUser = async () => {
    const targetUser = validUsersWithoutCredentials?.find(
      (user) => user.id === state.selectedUserId,
    );

    if (targetUser) {
      try {
        const credentials = await generateS3Credentials(
          projectId,
          targetUser.id,
        );
        setState({ ...state, isLoading: false });
        onSuccess({
          username: targetUser.username,
          description: targetUser.description,
          access: credentials.access,
          secret: credentials.secret,
        });
      } catch (e) {
        addError(
          t('pci_projects_project_users_add_error_message', {
            user: targetUser.description,
          }),
        );
        setState({ ...state, isLoading: false });
        goBack();
      }
    }
  };

  const onConfirm = async () => {
    setState({ ...state, isLoading: true });

    if (state.userType === 'NEW') {
      trackActionClick(COLD_ARCHIVE_TRACKING.USER.CREATE_USER_MODES.NEW_USER);
      addNewUser();
    }

    if (state.userType === 'EXISTING') {
      trackActionClick(
        COLD_ARCHIVE_TRACKING.USER.CREATE_USER_MODES.EXISTING_USER,
      );
      addExistingUser();
    }
  };

  useEffect(() => {
    if (
      state.userType === 'EXISTING' &&
      validUsersWithoutCredentials?.length > 0
    ) {
      setState({
        ...state,
        selectedUserId: validUsersWithoutCredentials[0].id,
      });
    }
  }, [state.userType]);

  return (
    <PciModal
      title={t('pci_projects_project_users_add_title')}
      submitText={t('pci_projects_project_users_add_submit_label')}
      cancelText={t('pci_projects_project_users_add_cancel_label')}
      isDisabled={
        state.isLoading ||
        !state.userType ||
        (state.userType === 'NEW' && !state.userDescription.value) ||
        (state.userType === 'EXISTING' && !state.selectedUserId)
      }
      onConfirm={onConfirm}
      onClose={onClose}
      onCancel={onCancel}
      isPending={state.isLoading}
    >
      <OdsText preset="paragraph" className="my-6">
        {t('pci_projects_project_users_add_short_description')}
      </OdsText>

      <div className="grid grid-cols-1 gap-4">
        {validUsersWithoutCredentials?.length > 0 && (
          <RadioOption
            checked={state.userType === 'EXISTING'}
            value="EXISTING"
            name="addExistingUser"
            label={t('pci_projects_project_users_add_existing_user')}
            onChange={() => setState({ ...state, userType: 'EXISTING' })}
          />
        )}

        {state.userType === 'EXISTING' && (
          <OdsSelect
            name="userNameDescriptionKey"
            value={`${state.selectedUserId}`}
            onOdsChange={(event) => {
              setState({
                ...state,
                selectedUserId: parseInt(event.detail.value, 10),
              });
            }}
            className="mb-8"
            customRenderer={{
              option: (data) => {
                return `<div style="display: flex; justify-content: space-between; align-items: center;">
                          <p style="font-size: 16px; margin: 0;">${data.text}</p>
                          <p style="font-size: 12px; margin: 0;">${data.hint}</p>
                        </div>`;
              },
            }}
          >
            {validUsersWithoutCredentials.map((user) => (
              <option
                value={user.id}
                key={user.id}
                data-hint={t(
                  user.s3Credentials
                    ? 'pci_projects_project_users_add_as_credentials'
                    : 'pci_projects_project_users_add_as_no_credentials',
                )}
              >
                {user.description
                  ? `${user.username} - ${user.description}`
                  : user.username}
              </option>
            ))}
          </OdsSelect>
        )}

        <RadioOption
          checked={state.userType === 'NEW'}
          value="NEW"
          name="createNewUser"
          label={t('pci_projects_project_users_add_create_user')}
          onChange={() => setState({ ...state, userType: 'NEW' })}
        />

        {state.userType === 'NEW' && (
          <OdsFormField>
            <LabelComponent
              text={t('pci_projects_project_users_add_description_label')}
            />

            <OdsInput
              value={state.userDescription.value}
              name="description"
              max={255}
              onOdsChange={(event) => {
                setState({
                  ...state,
                  userDescription: {
                    value: event.detail.value as string,
                    isTouched: true,
                  },
                });
              }}
            />
          </OdsFormField>
        )}
      </div>
    </PciModal>
  );
}
