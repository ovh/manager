import {
  OdsButton,
  OdsFormField,
  OdsMessage,
  OdsSelect,
  OdsSpinner,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import {
  OdsSelectCustomEvent,
  OdsSelectChangeEventDetail,
} from '@ovhcloud/ods-components';
import { TS3Credentials, TUser } from '@/api/data/users';
import {
  invalidateGetUsersCache,
  useGenerateS3Credentials,
  usePostS3Secret,
  useUsers,
} from '@/api/hooks/useUsers';
import LabelComponent from '@/components/Label.component';
import UserInformationTile from '@/components/UserInformationTile.component';

type LinkUserSelectorProps = {
  userId: number;
  onSelectOwner: (user: TUser) => void;
  onCancel: () => void;
};

export default function LinkUserSelector({
  userId,
  onSelectOwner,
  onCancel,
}: Readonly<LinkUserSelectorProps>) {
  const { t } = useTranslation('cold-archive/new/link-user');

  const { projectId } = useParams();

  const { validUsers, isPending: isGetUsersPending } = useUsers(projectId);
  const formUser = validUsers?.find((user) => user.id === userId);

  const [secretUser, setSecretUser] = useState('');
  const [s3Credentials, setS3Credentials] = useState<TS3Credentials | null>(
    null,
  );

  const [
    haveShowedOrGeneratedCredentials,
    setHaveShowedOrGeneratedCredentials,
  ] = useState(false);

  const {
    postS3Secret: showSecretKey,
    isPending: isSecretGenerationPending,
  } = usePostS3Secret({
    projectId,
    userId: formUser?.id,
    userAccess: formUser?.s3Credentials?.access,
    onSuccess: ({ secret }) => setSecretUser(secret),
  });

  const {
    generateS3Credentials,
    isPending: isCredentialsGenerationPending,
  } = useGenerateS3Credentials({
    projectId,
    onSuccess: (credentials) => {
      setS3Credentials(credentials);
      onSelectOwner({
        ...formUser,
        access: credentials?.access,
        s3Credentials: credentials,
      });
      setSecretUser(credentials.secret);
      invalidateGetUsersCache(projectId);
    },
  });

  useEffect(() => {
    if (formUser?.s3Credentials) {
      showSecretKey();
    }
  }, [formUser]);

  const onShowCredentials = () => {
    if (!formUser?.s3Credentials) {
      generateS3Credentials(formUser?.id);
    }

    setHaveShowedOrGeneratedCredentials(true);
  };

  const isPending =
    isGetUsersPending ||
    isSecretGenerationPending ||
    isCredentialsGenerationPending;

  const isDisabled = !formUser || haveShowedOrGeneratedCredentials || isPending;

  const handleSelectChange = useCallback(
    (event: OdsSelectCustomEvent<OdsSelectChangeEventDetail>) => {
      const user = validUsers?.find(
        (u) => u.id === parseInt(event.detail.value, 10),
      );
      onSelectOwner(user);
    },
    [validUsers],
  );

  return (
    <div className="flex flex-col gap-4">
      <OdsFormField className="block min-w-[40%]">
        <LabelComponent
          text={t(
            'pci_projects_project_storages_cold_archive_add_step_link_user_archive_mode_select_field_user_label',
          )}
        />

        <div className="flex gap-4 items-center">
          <OdsSelect
            className="min-w-[35rem]"
            key={`select-users-${validUsers?.length}`}
            value={`${formUser?.id}`}
            name="selectUser"
            isDisabled={haveShowedOrGeneratedCredentials || isPending}
            onOdsChange={(event) => handleSelectChange(event)}
            customRenderer={{
              option: (data) => {
                return `<div style="display: flex; justify-content: space-between; align-items: center;">
                          <p style="font-size: 16px; margin: 0;">${data?.text}</p>
                          <p style="font-size: 12px; margin: 0;">${data?.hint}</p>
                        </div>`;
              },
            }}
          >
            {validUsers?.map((user) => (
              <option
                key={user?.id}
                value={user?.id}
                data-hint={t(
                  user?.s3Credentials
                    ? 'pci_projects_project_storages_cold_archive_add_step_link_user_archive_mode_select_list_has_credential'
                    : 'pci_projects_project_storages_cold_archive_add_step_link_user_archive_mode_select_list_has_no_credential',
                )}
              >
                {user?.description
                  ? `${user?.username} -  ${user?.description}`
                  : user?.username}
              </option>
            ))}
          </OdsSelect>

          {isPending && <OdsSpinner size="sm" />}
        </div>
      </OdsFormField>
      {haveShowedOrGeneratedCredentials && s3Credentials && (
        <OdsMessage
          color="success"
          isDismissible
          onOdsRemove={() => setHaveShowedOrGeneratedCredentials(false)}
        >
          <UserInformationTile
            title={
              <OdsText preset="paragraph">
                <span
                  dangerouslySetInnerHTML={{
                    __html: t(
                      'users/credentials:pci_projects_project_storages_containers_add_linked_user_success_message',
                      {
                        username: `<strong>${formUser?.username}</strong>`,
                        // This hack is used beacause the italian translation use userName instead of username
                        userName: `<strong>${formUser?.username}</strong>`,
                      },
                    ),
                  }}
                />
              </OdsText>
            }
            username={formUser?.username}
            description={formUser?.description}
            accessKey={s3Credentials?.access}
            secret={secretUser}
          />
        </OdsMessage>
      )}
      <div className="flex gap-4">
        <OdsButton
          onClick={onCancel}
          variant="ghost"
          size="sm"
          isDisabled={isPending || undefined}
          label={t(
            'pci_projects_project_storages_cold_archive_add_step_link_user_archive_mode_select_field_user_cta_cancel',
          )}
        />
        <OdsButton
          variant="outline"
          label={t(
            'pci_projects_project_storages_cold_archive_add_step_link_user_archive_mode_select_field_user_cta_linked',
          )}
          size="sm"
          isDisabled={isDisabled}
          onClick={onShowCredentials}
        />
      </div>
    </div>
  );
}
