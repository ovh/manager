import {
  OdsRadio,
  OdsSpinner,
  OdsText,
  OdsModal,
  OdsButton,
  OdsSelect,
  OdsFormField,
  OdsInput,
} from '@ovhcloud/ods-components/react';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useNotifications as useMRCNotifications } from '@ovh-ux/manager-react-components';
import {
  createUser,
  generateS3Credentials,
  getUser,
  TUser,
} from '@/api/data/users';
import { invalidateGetUsersCache, useUsers } from '@/api/hooks/useUsers';
import UserInformationTile from '@/components/UserInformationTile.component';
import { COLD_ARCHIVE_TRACKING } from '@/tracking.constants';
import { poll } from '@/helpers';
import { useTracking } from '@/hooks/useTracking';
import { useNotifications } from '@/hooks/useNotifications';
import LabelComponent from '@/components/Label.component';

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

  const {
    trackActionClick,
    trackCancelAction,
    trackErrorPage,
    trackSuccessPage,
  } = useTracking(
    `${COLD_ARCHIVE_TRACKING.USER.MAIN}::${COLD_ARCHIVE_TRACKING.USER.ADD_USER}`,
  );

  const navigate = useNavigate();
  const goBack = () => navigate('..');

  const onCancel = () => {
    trackCancelAction();
    goBack();
  };

  const onClose = onCancel;

  const { addSuccess } = useMRCNotifications();
  const { addErrorMessage } = useNotifications({
    ns: 'users/create',
  });

  const [state, setState] = useState<TState>({
    userDescription: {
      value: '',
      isTouched: false,
    },
    isLoading: false,
  });

  const {
    validUsersWithoutCredentials,
    isPending: isPendingUsersWithoutcredentials,
  } = useUsers(projectId);

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
        trackingPrefix={COLD_ARCHIVE_TRACKING.USER.CLIPBOARD_PREFIX}
      />,
      false,
    );

    invalidateGetUsersCache(projectId);
    trackSuccessPage();
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
              addErrorMessage({
                i18nKey: 'pci_projects_project_users_add_error_message',
                values: { user: value.description },
              });
              setState({ ...state, isLoading: false });
              trackErrorPage();
              goBack();
            });
        },
        onFail: () => {
          addErrorMessage({
            i18nKey: 'pci_projects_project_users_add_error_message',
            values: { user: newUser.description },
          });
          setState({ ...state, isLoading: false });
          trackErrorPage();
          goBack();
        },
      });
    } catch (e) {
      addErrorMessage({
        i18nKey: 'pci_projects_project_users_add_error_message',
        values: { user: state.userDescription.value },
      });
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
        addErrorMessage({
          i18nKey: 'pci_projects_project_users_add_error_message',
          values: { user: targetUser.description },
        });
        setState({ ...state, isLoading: false });
        trackErrorPage();
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

  const isDisabled =
    state.isLoading ||
    !state.userType ||
    (state.userType === 'NEW' && !state.userDescription.value) ||
    (state.userType === 'EXISTING' && !state.selectedUserId);

  const modalRef = useRef(undefined);

  /* The following useEffect is a hack to allow the OdsSelect overflowing
   * in the OdsModal thus allowing the user to select an item even for long lists.
   * This hack can be removed once this issue is fixed on ods side, and this
   * version of ods is available in pci-common & manager-react-components.
   */
  useEffect(() => {
    if (!modalRef.current) return;
    const { shadowRoot } = modalRef?.current;
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
    <OdsModal color={'information'} isOpen onOdsClose={onClose} ref={modalRef}>
      <>
        <OdsText preset="heading-3">
          {t('pci_projects_project_users_add_title')}
        </OdsText>
        <slot name="content">
          {state.isLoading || isPendingUsersWithoutcredentials ? (
            <OdsSpinner size="md" className="block text-center mt-6 mb-8" />
          ) : (
            <div className="mt-6 mb-8">
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
                    onChange={() =>
                      setState({ ...state, userType: 'EXISTING' })
                    }
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
                          <p style="font-size: 16px; margin: 0; text-overflow: ellipsis; white-space: nowrap; overflow: hidden; width:70%">${data?.text}</p>
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
                      text={t(
                        'pci_projects_project_users_add_description_label',
                      )}
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
            </div>
          )}
        </slot>

        <OdsButton
          label={t('pci_projects_project_users_add_cancel_label')}
          color="primary"
          variant="ghost"
          onClick={onCancel}
          isDisabled={state.isLoading}
          slot="actions"
        />
        <OdsButton
          label={t('pci_projects_project_users_add_submit_label')}
          color="primary"
          onClick={onConfirm}
          isDisabled={
            isDisabled || state.isLoading || isPendingUsersWithoutcredentials
          }
          slot="actions"
        />
      </>
    </OdsModal>
  );
}
