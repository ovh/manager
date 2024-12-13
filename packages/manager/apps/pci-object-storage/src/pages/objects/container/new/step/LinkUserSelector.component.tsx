import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_BUTTON_SIZE,
  ODS_BUTTON_VARIANT,
  ODS_SPINNER_SIZE,
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
  OdsSelectValueChangeEvent,
} from '@ovhcloud/ods-components';
import {
  OsdsButton,
  OsdsFormField,
  OsdsSelect,
  OsdsSelectOption,
  OsdsSpinner,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { useEffect, useRef, useState } from 'react';
import {
  getQueryKeyUsers,
  usePostS3Secret,
  useUsers,
} from '@/api/hooks/useUser';
import LabelComponent from '@/components/Label.component';
import { generateS3Credentials, TUser } from '@/api/data/user';
import queryClient from '@/queryClient';
import UserInformationTile from './UserInformationTile.component';

type LinkUserSelectorProps = {
  formUser: TUser;
  onSelectOwner: (user: TUser) => void;
  onCancel: () => void;
};
export default function LinkUserSelector({
  formUser,
  onSelectOwner,
  onCancel,
}: Readonly<LinkUserSelectorProps>) {
  const { t: tAssociateUser } = useTranslation(
    'containers/associate-user-to-container',
  );
  const { projectId } = useParams();
  const { data: listUsers, isPending: isPendingListUsers } = useUsers(
    projectId,
  );

  const [secretUser, setSecretUser] = useState('');

  const [
    haveShowedOrGeneratedCredentials,
    setHaveShowedOrGeneratedCredentials,
  ] = useState(false);

  const { postS3Secret: showSecretKey } = usePostS3Secret({
    projectId,
    userId: formUser?.id,
    userAccess: formUser?.s3Credentials?.access,
    onSuccess: ({ secret }) => {
      setSecretUser(secret);
    },
    onError: () => {},
  });

  /**
   * this prevent onOdsValueChange to be triggered twice, it can be removed
   * when the issue on the OsdsSelect is fixed.
   * @TODO remove when migrating to ODS 18
   */
  const listenForChangeEventsRef = useRef(true);
  useEffect(() => {
    listenForChangeEventsRef.current = true;
    if (formUser?.s3Credentials) {
      showSecretKey();
    }
  }, [formUser]);

  const onShowCredentials = async () => {
    if (!formUser?.s3Credentials) {
      const credentials = await generateS3Credentials(projectId, formUser?.id);
      await queryClient.invalidateQueries({
        queryKey: [...getQueryKeyUsers(projectId), formUser.id],
      });
      onSelectOwner({
        ...formUser,
        s3Credentials: credentials,
      });
    }
    setHaveShowedOrGeneratedCredentials(true);
  };

  const isDisabled =
    !formUser ||
    haveShowedOrGeneratedCredentials ||
    isPendingListUsers ||
    undefined;

  return (
    <>
      <OsdsFormField className="mt-6">
        <LabelComponent
          text={tAssociateUser(
            'pci_projects_project_storages_containers_add_create_or_linked_user_linked_user_label',
          )}
        />
        <div className="flex items-center">
          <OsdsSelect
            value={formUser?.id}
            key={formUser?.id}
            inline
            className="min-w-[20%]"
            color={ODS_THEME_COLOR_INTENT.text}
            disabled={
              haveShowedOrGeneratedCredentials ||
              isPendingListUsers ||
              undefined
            }
            onOdsValueChange={(event: OdsSelectValueChangeEvent) => {
              if (listenForChangeEventsRef.current) {
                const user = listUsers.find((u) => u.id === event.detail.value);
                listenForChangeEventsRef.current = false;
                onSelectOwner(user);
              }
            }}
          >
            {formUser?.description ? (
              <OsdsText
                level={ODS_TEXT_LEVEL.body}
                color={ODS_THEME_COLOR_INTENT.text}
                size={ODS_TEXT_SIZE._400}
                slot="selectedLabel"
              >
                {formUser?.username} - {formUser?.description}
              </OsdsText>
            ) : (
              <OsdsText
                level={ODS_TEXT_LEVEL.body}
                color={ODS_THEME_COLOR_INTENT.text}
                size={ODS_TEXT_SIZE._400}
                slot="selectedLabel"
              >
                {formUser?.username}
              </OsdsText>
            )}
            {listUsers?.map((user) => (
              <OsdsSelectOption key={user.id} value={user.id}>
                {user?.description ? (
                  <OsdsText
                    level={ODS_TEXT_LEVEL.body}
                    color={ODS_THEME_COLOR_INTENT.text}
                    size={ODS_TEXT_SIZE._400}
                    className="mr-48"
                  >
                    {user?.username} - {user?.description}
                  </OsdsText>
                ) : (
                  <OsdsText
                    level={ODS_TEXT_LEVEL.body}
                    color={ODS_THEME_COLOR_INTENT.text}
                    size={ODS_TEXT_SIZE._400}
                    className="mr-48"
                  >
                    {user?.username}
                  </OsdsText>
                )}
                <OsdsText
                  level={ODS_TEXT_LEVEL.body}
                  size={ODS_TEXT_SIZE._200}
                  color={ODS_THEME_COLOR_INTENT.text}
                >
                  {tAssociateUser(
                    user.s3Credentials
                      ? 'pci_projects_project_storages_containers_add_create_or_linked_user_linked_user_has_credential'
                      : 'pci_projects_project_storages_containers_add_create_or_linked_user_linked_user_has_not_credential',
                  )}
                </OsdsText>
              </OsdsSelectOption>
            ))}
          </OsdsSelect>
          {isPendingListUsers && (
            <OsdsSpinner
              inline
              size={ODS_SPINNER_SIZE.sm}
              className="ml-6 align-center"
            />
          )}
        </div>
      </OsdsFormField>
      {haveShowedOrGeneratedCredentials && (
        <UserInformationTile secretUser={secretUser} user={formUser} />
      )}
      <div className="mt-6 flex">
        <OsdsButton
          onClick={onCancel}
          variant={ODS_BUTTON_VARIANT.ghost}
          size={ODS_BUTTON_SIZE.sm}
          color={ODS_THEME_COLOR_INTENT.primary}
          disabled={isPendingListUsers || undefined}
        >
          {tAssociateUser(
            'pci_projects_project_storages_containers_add_create_or_linked_user_linked_user_btn_cancel',
          )}
        </OsdsButton>
        <OsdsButton
          variant={ODS_BUTTON_VARIANT.stroked}
          color={ODS_THEME_COLOR_INTENT.primary}
          size={ODS_BUTTON_SIZE.sm}
          class="ml-4"
          disabled={isDisabled}
          onClick={onShowCredentials}
        >
          {tAssociateUser(
            'pci_projects_project_storages_containers_add_create_or_linked_user_linked_user_btn_linked',
          )}
        </OsdsButton>
      </div>
    </>
  );
}
