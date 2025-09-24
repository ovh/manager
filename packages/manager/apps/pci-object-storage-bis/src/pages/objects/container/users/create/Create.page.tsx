import { PciModal } from '@ovh-ux/manager-pci-common';
import { useTranslation } from 'react-i18next';
import { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import {
  useNotifications,
  Clipboard,
  useFeatureAvailability,
} from '@ovh-ux/manager-react-components';
import {
  OdsFormField,
  OdsInput,
  OdsMessage,
  OdsPassword,
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
import {
  AVAILABILITY,
  TRACKING_PREFIX,
  TRACKING_S3_POLICY_ADD,
} from '@/constants';
import queryClient from '@/queryClient';
import LabelComponent from '@/components/Label.component';

type TState = {
  userType?: 'new' | 'existing';
  selectedUserId?: number;
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
  const { data: availability, isPending } = useFeatureAvailability([
    AVAILABILITY.LOCALZONE,
  ]);

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
      <div className="w-full">
        <OdsText>
          <span
            dangerouslySetInnerHTML={{
              __html: tCredential(
                'pci_projects_project_storages_containers_add_linked_user_success_message',
                { username: `<strong> ${username}</strong>` },
              ),
            }}
          ></span>
        </OdsText>

        <div className="grid grid-cols-1 sm:grid-cols-2 mt-8 gap-6">
          <OdsFormField>
            <LabelComponent
              text={tCredential(
                'pci_projects_project_storages_containers_add_create_or_linked_user_create_user_success_username_label',
              )}
            />
            <Clipboard className="w-[100%]" value={username} />
          </OdsFormField>

          <OdsFormField>
            <LabelComponent
              text={tCredential(
                'pci_projects_project_storages_containers_add_create_or_linked_user_create_user_success_access-key_label',
              )}
            />

            <Clipboard className="w-[100%]" value={access} />
          </OdsFormField>

          <OdsFormField>
            <LabelComponent
              text={tCredential(
                'pci_projects_project_storages_containers_add_create_or_linked_user_create_user_success_description_label',
              )}
            />
            <Clipboard className="w-[100%]" value={description} />
          </OdsFormField>

          <OdsFormField>
            <LabelComponent
              text={tCredential(
                'pci_projects_project_storages_containers_add_create_or_linked_user_create_user_success_secret-key_label',
              )}
            />
            {/* Ods clipboard doesn't currently allows input of type password */}
            {/* @TODO refactor when clipboard allows password input types */}
            <div className="flex">
              <div className="flex-1">
                <OdsPassword
                  className="w-[100%]"
                  name="secret"
                  value={secret}
                  isReadonly
                />
              </div>
              <Clipboard className="w-[2rem]" value={secret} />
            </div>
          </OdsFormField>
        </div>
      </div>
    );
    addSuccess(content, false);
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
                trackPage(`${TRACKING_S3_POLICY_ADD}-error`);
                addError(
                  tAdd('pci_projects_project_users_add_error_message', {
                    user: value.description,
                  }),
                );
                setState({ ...state, isLoading: false });
                goBack();
              });
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
        state.isLoading ||
        !state.userType ||
        (state.userType === 'new' && !state.userDescription.value) ||
        (state.userType === 'existing' && !state.selectedUserId)
      }
      onConfirm={onConfirm}
      onClose={onClose}
      onCancel={onCancel}
      isPending={state.isLoading || isPending}
    >
      {(availability?.[AVAILABILITY.LOCALZONE] ||
        validUsersWithoutCredentials?.length > 0) && (
        <OdsMessage color="information" isDismissible={false}>
          {tAdd('pci_projects_project_users_add_info_banner')}
        </OdsMessage>
      )}

      <OdsText preset="paragraph" className="my-6">
        {tAdd('pci_projects_project_users_add_short_description')}
      </OdsText>

      <div className="grid grid-cols-1 gap-4">
        {validUsersWithoutCredentials?.length > 0 && (
          <div className="flex items-center mb-2">
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
              <OdsText preset="span">
                {tAdd('pci_projects_project_users_add_existing_user')}
              </OdsText>
            </label>
          </div>
        )}

        {state.userType === 'existing' && (
          <OdsSelect
            name="selectedUserId"
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
            {validUsersWithoutCredentials?.map((user) => (
              <option
                value={user?.id}
                key={user?.id}
                data-hint={tAdd(
                  user.s3Credentials
                    ? 'pci_projects_project_users_add_as_credentials'
                    : 'pci_projects_project_users_add_as_no_credentials',
                )}
              >
                {user?.description
                  ? `${user?.username} -  ${user?.description}`
                  : user.username}
              </option>
            ))}
          </OdsSelect>
        )}

        <div className="flex items-center mb-2">
          <OdsRadio
            value="new"
            onOdsChange={() => setState({ ...state, userType: 'new' })}
            name="userType"
            inputId="userType-new"
            className="mr-4"
          />
          <label htmlFor="userType-new">
            <OdsText preset="span">
              {tAdd('pci_projects_project_users_add_create_user')}
            </OdsText>
          </label>
        </div>

        {state.userType === 'new' && (
          <OdsFormField>
            <LabelComponent
              text={tAdd('pci_projects_project_users_add_description_label')}
            />

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
