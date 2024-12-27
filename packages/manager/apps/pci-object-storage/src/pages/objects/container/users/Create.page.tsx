import { PciModal } from '@ovh-ux/manager-pci-common';
import { useTranslation } from 'react-i18next';
import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useNotifications, Clipboard } from '@ovh-ux/manager-react-components';
import {
  OdsFormField,
  OdsInput,
  OdsMessage,
  OdsRadio,
  OdsSelect,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { useUsers } from '@/api/hooks/useUser';
import {
  createUser,
  generateS3Credentials,
  getUser,
  TUser,
} from '@/api/data/user';
import { poll } from '@/utils';
import { TRACKING_PREFIX, TRACKING_S3_POLICY_ADD } from '@/constants';
import queryClient from '@/queryClient';

type TState = {
  userType?: 'new' | 'existing';
  selectedUserId?: string;
  userDescription: {
    value: string;
    isTouched: boolean;
  };
  isLoading: boolean;
};

export default function UserCreatePage(): JSX.Element {
  const { t: tAdd } = useTranslation('objects/users/add');
  const { t: tCredential } = useTranslation('credential-banner');

  const navigate = useNavigate();

  const goBack = () => {
    navigate('..');
  };

  const { addSuccess, addError } = useNotifications();

  const { tracking } = useContext(ShellContext).shell;

  const [state, setState] = useState<TState>({
    userDescription: {
      value: '',
      isTouched: false,
    },
    isLoading: false,
  });

  const trackClick = (name: string) => {
    tracking?.trackClick({
      name,
      type: 'action',
    });
  };

  const trackPage = (name: string) => {
    tracking?.trackPage({
      name: `${TRACKING_PREFIX}::${name}`,
      type: 'navigation',
    });
  };

  const { projectId } = useParams();

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
    const content = (
      <>
        <div>
          {tCredential(
            'pci_projects_project_storages_containers_add_linked_user_success_message',
            { username },
          )}
        </div>
        <div className="width-full grid grid-cols-1 sm:grid-cols-2 mt-8 gap-6">
          <div>
            <OdsFormField>
              <label slot="label">
                {tCredential(
                  'pci_projects_project_storages_containers_add_create_or_linked_user_create_user_success_username_label',
                )}
              </label>
              <Clipboard value={username} id="" />
            </OdsFormField>
          </div>
          <div>
            <OdsFormField>
              <label slot="label">
                {tCredential(
                  'pci_projects_project_storages_containers_add_create_or_linked_user_create_user_success_access-key_label',
                )}
              </label>
              <Clipboard value={access} />
            </OdsFormField>
          </div>
          <div>
            <OdsFormField>
              <label slot="label">
                {tCredential(
                  'pci_projects_project_storages_containers_add_create_or_linked_user_create_user_success_description_label',
                )}
              </label>
              <Clipboard value={description} />
            </OdsFormField>
          </div>
          <div>
            <OdsFormField>
              <label slot="label">
                {tCredential(
                  'pci_projects_project_storages_containers_add_create_or_linked_user_create_user_success_secret-key_label',
                )}
              </label>
              <Clipboard value={secret} />
            </OdsFormField>
          </div>
        </div>
      </>
    );
    addSuccess(content, true);
    queryClient.invalidateQueries({
      queryKey: ['project', projectId, 'users'],
    });
    goBack();
  };

  const onConfirm = async () => {
    trackClick(`${TRACKING_S3_POLICY_ADD}::confirm`);
    setState({ ...state, isLoading: true });
    if (state.userType === 'new') {
      try {
        const newUser = await createUser(
          projectId,
          state.userDescription.value,
        );

        poll<TUser>({
          fn: () => getUser(projectId, newUser.id),
          ruleFn: (user: TUser) => user.status === 'ok',
          onSuccess: async ({ value }) => {
            try {
              const credentials = await generateS3Credentials(
                projectId,
                value.id,
              );
              setState({ ...state, isLoading: false });
              onSuccess({
                username: value.username,
                description: value.description,
                access: credentials.access,
                secret: credentials.secret,
              });
            } catch (e) {
              trackPage(`${TRACKING_S3_POLICY_ADD}-error`);
              addError(
                tAdd('pci_projects_project_users_add_error_message', {
                  user: value.description,
                }),
              );
              setState({ ...state, isLoading: false });
              goBack();
            }
          },
          onFail: () => {
            trackPage(`${TRACKING_S3_POLICY_ADD}-error`);
            addError(
              tAdd('pci_projects_project_users_add_error_message', {
                user: newUser.description,
              }),
            );
            setState({ ...state, isLoading: false });
            goBack();
          },
        });
      } catch (e) {
        addError(tAdd('pci_projects_project_users_add_error_message'));
      }
    }
    if (state.userType === 'existing') {
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
          trackPage(`${TRACKING_S3_POLICY_ADD}-error`);
          addError(
            tAdd('pci_projects_project_users_add_error_message', {
              user: targetUser.description,
            }),
          );
          setState({ ...state, isLoading: false });
          goBack();
        }
      }
    }
  };

  const onCancel = () => {
    trackClick(`${TRACKING_S3_POLICY_ADD}::cancel`);
    goBack();
  };

  const onClose = () => {
    goBack();
  };

  useEffect(() => {
    if (
      state.userType === 'existing' &&
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
      title={tAdd('pci_projects_project_users_add_title')}
      submitText={tAdd('pci_projects_project_users_add_submit_label')}
      cancelText={tAdd('pci_projects_project_users_add_cancel_label')}
      isDisabled={
        !state.userType ||
        (state.userType === 'new' && !state.userDescription.value) ||
        (state.userType === 'existing' && !state.selectedUserId)
      }
      onConfirm={onConfirm}
      onClose={onClose}
      onCancel={onCancel}
      isPending={state.isLoading}
    >
      {validUsersWithoutCredentials?.length > 0 && (
        <OdsMessage color="information">
          <OdsText preset="paragraph">
            {tAdd('pci_projects_project_users_add_info_banner')}
          </OdsText>
        </OdsMessage>
      )}
      <p>
        <OdsText preset="paragraph">
          {tAdd('pci_projects_project_users_add_short_description')}
        </OdsText>
      </p>
      <div className="grid grid-cols-1 gap-4">
        {validUsersWithoutCredentials?.length > 0 && (
          <div className="flex">
            <OdsRadio
              isChecked={state.userType === 'existing'}
              value="existing"
              name="userType"
              inputId="userType-existing"
              className="mr-4"
              onOdsChange={() => {
                setState({ ...state, userType: 'existing' });
              }}
            />
            <label htmlFor="userType-existing">
              <OdsText>
                {tAdd('pci_projects_project_users_add_existing_user')}
              </OdsText>
            </label>
          </div>
        )}
        {state.userType === 'existing' && (
          <OdsSelect
            name="selectedUserId"
            value={state.selectedUserId}
            onOdsChange={(event) => {
              setState({
                ...state,
                selectedUserId: event.detail.value as string,
              });
            }}
            className="ml-10 mt-4 mb-6"
          >
            {validUsersWithoutCredentials?.map((user) => (
              <option key={user.id} value={user.id}>
                {user.username} - {user.description}
              </option>
            ))}
          </OdsSelect>
        )}
        <div className="flex">
          <OdsRadio
            value="new"
            onOdsChange={() => setState({ ...state, userType: 'new' })}
            name="userType"
            inputId="userType-new"
            className="mr-4"
          />
          <label htmlFor="userType-new">
            <OdsText>
              {tAdd('pci_projects_project_users_add_create_user')}
            </OdsText>
          </label>
        </div>
        {state.userType === 'new' && (
          <OdsFormField>
            <label slot="label">
              {tAdd('pci_projects_project_users_add_description_label')}
            </label>
            <OdsInput
              value={state.userDescription.value}
              name="description"
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
