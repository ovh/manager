import {
  OdsButton,
  OdsFormField,
  OdsMessage,
  OdsSelect,
  OdsSpinner,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { useCallback, useState } from 'react';
import { Translation, useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import {
  OdsSelectCustomEvent,
  OdsSelectChangeEventDetail,
} from '@ovhcloud/ods-components';
import { TUser } from '@/api/data/users';
import {
  invalidateGetUsersCache,
  useUserCredentials,
  useUsers,
} from '@/api/hooks/useUsers';
import LabelComponent from '@/components/Label.component';
import UserInformationTile from '@/components/UserInformationTile.component';
import { COLD_ARCHIVE_TRACKING } from '@/tracking.constants';
import { useTracking } from '@/hooks/useTracking';

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
  const { t } = useTranslation(['cold-archive/new/link-user', 'users']);
  const { projectId } = useParams();
  const { validUsers, isPending: isUsersPending } = useUsers(projectId);
  const selectedUser = validUsers?.find((user) => user.id === userId);
  const [credentials, setCredentials] = useState<TUser['s3Credentials']>();
  const [isCredentialsVisible, setCredentialsVisible] = useState(false);
  const { addError } = useNotifications();

  const { trackCancelAction, trackConfirmAction } = useTracking(
    `${COLD_ARCHIVE_TRACKING.CONTAINERS.ADD_CONTAINER}::${COLD_ARCHIVE_TRACKING.ADD_USER.ASSOCIATE.EXISTING_USER}`,
  );
  const { trackSuccessPage, trackErrorPage } = useTracking(
    `${COLD_ARCHIVE_TRACKING.CONTAINERS.ADD_CONTAINER}::${COLD_ARCHIVE_TRACKING.ADD_USER.ASSOCIATE.ASSOCIATE_USER}`,
  );

  const {
    getCredentialsAsync,
    isPending: isCredentialsPending,
  } = useUserCredentials(projectId, selectedUser?.id);

  const onShowCredentials = async () => {
    trackConfirmAction();
    try {
      const s3Credentials = await getCredentialsAsync();
      setCredentials(s3Credentials);
      setCredentialsVisible(true);
      trackSuccessPage();
    } catch (error) {
      addError(
        <Translation ns="users">
          {(_t) =>
            _t(
              'pci_projects_project_storages_containers_users_show_secret_key_error',
              {
                user: selectedUser?.username,
                message:
                  error?.response?.data?.message || error?.message || null,
              },
            )
          }
        </Translation>,
        true,
      );
      trackErrorPage();
    }
  };

  const isPending = isUsersPending || isCredentialsPending;
  const isDisabled = !selectedUser || isPending;

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
            className="w-full max-w-[35rem]"
            key={`select-users-${validUsers?.length}`}
            defaultValue={`${selectedUser?.id}`}
            name="selectUser"
            isDisabled={isCredentialsVisible || isPending}
            onOdsChange={handleSelectChange}
            customRenderer={{
              option: (data) => {
                return `<div style="display: flex; justify-content: space-between; align-items: center;">
                          <p style="font-size: 16px; margin: 0; text-overflow: ellipsis; white-space: nowrap; overflow: hidden; width:70%">${data?.text}</p>
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

      {isCredentialsVisible && credentials && (
        <OdsMessage
          color="success"
          isDismissible
          onOdsRemove={() => {
            invalidateGetUsersCache(projectId);
            setCredentialsVisible(false);
          }}
        >
          <UserInformationTile
            title={
              <OdsText preset="paragraph">
                <span
                  dangerouslySetInnerHTML={{
                    __html: t(
                      'users/credentials:pci_projects_project_storages_containers_add_linked_user_success_message',
                      {
                        username: `<strong>${selectedUser?.username}</strong>`,
                        // This hack is used beacause the italian translation use userName instead of username
                        userName: `<strong>${selectedUser?.username}</strong>`,
                      },
                    ),
                  }}
                />
              </OdsText>
            }
            username={selectedUser?.username}
            description={selectedUser?.description}
            accessKey={credentials?.access}
            secret={credentials?.secret}
            trackingPrefix={
              COLD_ARCHIVE_TRACKING.CONTAINERS.USER.CLIPBOARD_PREFIX
            }
          />
        </OdsMessage>
      )}

      <div className="flex gap-4">
        <OdsButton
          onClick={() => {
            trackCancelAction();
            onCancel();
          }}
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
