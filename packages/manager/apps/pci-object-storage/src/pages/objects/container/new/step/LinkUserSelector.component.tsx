import {
  OdsButton,
  OdsFormField,
  OdsSelect,
  OdsSpinner,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import { TUser, generateS3Credentials } from '@/api/data/user';
import {
  getQueryKeyUsers,
  usePostS3Secret,
  useUsers,
} from '@/api/hooks/useUser';
import LabelComponent from '@/components/Label.component';
import queryClient from '@/queryClient';
import UserInformationTile from './UserInformationTile.component';

type LinkUserSelectorProps = {
  userId: string;
  onSelectOwner: (user: TUser) => void;
  onCancel: () => void;
};
export default function LinkUserSelector({
  userId,
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
  const formUser = listUsers?.find((user) => `${user.id}` === userId);

  const [secretUser, setSecretUser] = useState('');

  const [
    haveShowedOrGeneratedCredentials,
    setHaveShowedOrGeneratedCredentials,
  ] = useState(false);

  const { postS3Secret: showSecretKey } = usePostS3Secret({
    projectId,
    userId: `${formUser?.id}`,
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
  useEffect(() => {
    console.log('formUser', formUser);
    if (formUser?.s3Credentials) {
      showSecretKey();
    }
  }, [formUser]);

  const onShowCredentials = async () => {
    if (!formUser?.s3Credentials) {
      const credentials = await generateS3Credentials(
        projectId,
        `${formUser?.id}`,
      );
      await queryClient.invalidateQueries({
        queryKey: [...getQueryKeyUsers(projectId), formUser?.id],
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
      <OdsFormField className="mt-6 min-w-[40%]">
        <LabelComponent
          text={tAssociateUser(
            'pci_projects_project_storages_containers_add_create_or_linked_user_linked_user_label',
          )}
        />
        <div>
          <OdsSelect
            value={`${formUser?.id}`}
            name="selectUser"
            isDisabled={
              haveShowedOrGeneratedCredentials ||
              isPendingListUsers ||
              undefined
            }
            onOdsChange={(event) => {
              const user = listUsers.find(
                (u) => u.id === parseInt(event.detail.value, 10),
              );
              onSelectOwner(user);
            }}
          >
            {formUser?.description ? (
              <OdsText preset="paragraph" slot="selectedLabel">
                {formUser?.username} - {formUser?.description}
              </OdsText>
            ) : (
              <OdsText preset="paragraph" slot="selectedLabel">
                {formUser?.username}
              </OdsText>
            )}
            {listUsers?.map((user) =>
              user?.description ? (
                <option key={user.id} value={user.id}>
                  {user?.username} - {user?.description}{' '}
                  {tAssociateUser(
                    user.s3Credentials
                      ? 'pci_projects_project_storages_containers_add_create_or_linked_user_linked_user_has_credential'
                      : 'pci_projects_project_storages_containers_add_create_or_linked_user_linked_user_has_not_credential',
                  )}
                </option>
              ) : (
                <option key={user.id} value={user.id}>
                  {user?.username}{' '}
                  {tAssociateUser(
                    user.s3Credentials
                      ? 'pci_projects_project_storages_containers_add_create_or_linked_user_linked_user_has_credential'
                      : 'pci_projects_project_storages_containers_add_create_or_linked_user_linked_user_has_not_credential',
                  )}{' '}
                </option>
              ),
            )}
          </OdsSelect>
          {isPendingListUsers && (
            <OdsSpinner size="sm" className="ml-6 align-center" />
          )}
        </div>
      </OdsFormField>
      <div>
        {haveShowedOrGeneratedCredentials && (
          <UserInformationTile secretUser={secretUser} user={formUser} />
        )}
      </div>
      <div className="mt-6 flex">
        <OdsButton
          onClick={onCancel}
          variant="ghost"
          size="sm"
          color="primary"
          isDisabled={isPendingListUsers || undefined}
          label={tAssociateUser(
            'pci_projects_project_storages_containers_add_create_or_linked_user_linked_user_btn_cancel',
          )}
        />
        <OdsButton
          variant="outline"
          label={tAssociateUser(
            'pci_projects_project_storages_containers_add_create_or_linked_user_linked_user_btn_linked',
          )}
          color="primary"
          size="sm"
          class="ml-4"
          isDisabled={isDisabled}
          onClick={onShowCredentials}
        />
      </div>
    </>
  );
}
