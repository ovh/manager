import { PciModal } from '@ovh-ux/manager-pci-common';
import { useTranslation } from 'react-i18next';
import {
  OsdsText,
  OsdsMessage,
  OsdsRadioButton,
  OsdsRadio,
  OsdsSelectOption,
  OsdsSelect,
  OsdsFormField,
  OsdsInput,
} from '@ovhcloud/ods-components/react';
import {
  ODS_INPUT_TYPE,
  ODS_MESSAGE_TYPE,
  ODS_RADIO_BUTTON_SIZE,
} from '@ovhcloud/ods-components';
import {
  ODS_THEME_COLOR_INTENT,
  ODS_THEME_TYPOGRAPHY_LEVEL,
  ODS_THEME_TYPOGRAPHY_SIZE,
} from '@ovhcloud/ods-common-theming';
import { useContext, useEffect, useState } from 'react';
import clsx from 'clsx';
import { useNavigate, useParams } from 'react-router-dom';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useNotifications, Clipboard } from '@ovh-ux/manager-react-components';
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
            <OsdsFormField>
              <OsdsText
                level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                size={ODS_THEME_TYPOGRAPHY_SIZE._200}
                color={ODS_THEME_COLOR_INTENT.text}
                slot="label"
              >
                {tCredential(
                  'pci_projects_project_storages_containers_add_create_or_linked_user_create_user_success_username_label',
                )}
              </OsdsText>
              <Clipboard value={username} />
            </OsdsFormField>
          </div>
          <div>
            <OsdsFormField>
              <OsdsText
                level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                size={ODS_THEME_TYPOGRAPHY_SIZE._200}
                color={ODS_THEME_COLOR_INTENT.text}
                slot="label"
              >
                {tCredential(
                  'pci_projects_project_storages_containers_add_create_or_linked_user_create_user_success_access-key_label',
                )}
              </OsdsText>
              <Clipboard value={access} />
            </OsdsFormField>
          </div>
          <div>
            <OsdsFormField>
              <OsdsText
                level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                size={ODS_THEME_TYPOGRAPHY_SIZE._200}
                color={ODS_THEME_COLOR_INTENT.text}
                slot="label"
              >
                {tCredential(
                  'pci_projects_project_storages_containers_add_create_or_linked_user_create_user_success_description_label',
                )}
              </OsdsText>
              <Clipboard value={description} />
            </OsdsFormField>
          </div>
          <div>
            <OsdsFormField>
              <OsdsText
                level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                size={ODS_THEME_TYPOGRAPHY_SIZE._200}
                color={ODS_THEME_COLOR_INTENT.text}
                slot="label"
              >
                {tCredential(
                  'pci_projects_project_storages_containers_add_create_or_linked_user_create_user_success_secret-key_label',
                )}
              </OsdsText>
              <Clipboard value={secret} />
            </OsdsFormField>
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
        <OsdsMessage type={ODS_MESSAGE_TYPE.info}>
          <OsdsText
            level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
            size={ODS_THEME_TYPOGRAPHY_SIZE._400}
            color={ODS_THEME_COLOR_INTENT.text}
          >
            {tAdd('pci_projects_project_users_add_info_banner')}
          </OsdsText>
        </OsdsMessage>
      )}
      <p>
        <OsdsText
          level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
          size={ODS_THEME_TYPOGRAPHY_SIZE._400}
          color={ODS_THEME_COLOR_INTENT.text}
        >
          {tAdd('pci_projects_project_users_add_short_description')}
        </OsdsText>
      </p>
      <div className="grid grid-cols-1 gap-4">
        {validUsersWithoutCredentials?.length > 0 && (
          <OsdsRadio checked={state.userType === 'existing'}>
            <OsdsRadioButton
              size={ODS_RADIO_BUTTON_SIZE.xs}
              color={ODS_THEME_COLOR_INTENT.primary}
              onClick={() => {
                setState({ ...state, userType: 'existing' });
              }}
            >
              <OsdsText
                level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
                size={ODS_THEME_TYPOGRAPHY_SIZE._400}
                color={ODS_THEME_COLOR_INTENT.text}
                className={clsx(state.userType === 'existing' && 'font-bold')}
                slot="end"
              >
                {tAdd('pci_projects_project_users_add_existing_user')}
              </OsdsText>
            </OsdsRadioButton>
          </OsdsRadio>
        )}
        {state.userType === 'existing' && (
          <div>
            <OsdsSelect
              value={state.selectedUserId}
              onOdsValueChange={(event) => {
                setState({
                  ...state,
                  selectedUserId: event.detail.value as string,
                });
              }}
              className="ml-10 mt-4"
            >
              {validUsersWithoutCredentials?.map((user) => (
                <OsdsSelectOption key={user.id} value={user.id}>
                  {user.username} - {user.description}
                </OsdsSelectOption>
              ))}
            </OsdsSelect>
          </div>
        )}
        <OsdsRadio checked={state.userType === 'new'}>
          <OsdsRadioButton
            size={ODS_RADIO_BUTTON_SIZE.xs}
            color={ODS_THEME_COLOR_INTENT.primary}
            onClick={() => {
              setState({ ...state, userType: 'new' });
            }}
          >
            <OsdsText
              level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
              size={ODS_THEME_TYPOGRAPHY_SIZE._400}
              color={ODS_THEME_COLOR_INTENT.text}
              className={clsx(state.userType === 'new' && 'font-bold')}
              slot="end"
            >
              {tAdd('pci_projects_project_users_add_create_user')}
            </OsdsText>
          </OsdsRadioButton>
        </OsdsRadio>
        {state.userType === 'new' && (
          <OsdsFormField>
            <OsdsText
              level={ODS_THEME_TYPOGRAPHY_LEVEL.body}
              size={ODS_THEME_TYPOGRAPHY_SIZE._400}
              color={ODS_THEME_COLOR_INTENT.text}
              slot="label"
              className="font-bold"
            >
              {tAdd('pci_projects_project_users_add_description_label')}
            </OsdsText>
            <OsdsInput
              type={ODS_INPUT_TYPE.text}
              value={state.userDescription.value}
              onOdsValueChange={(event) => {
                setState({
                  ...state,
                  userDescription: {
                    value: event.detail.value as string,
                    isTouched: true,
                  },
                });
              }}
            />
          </OsdsFormField>
        )}
      </div>
    </PciModal>
  );
}
