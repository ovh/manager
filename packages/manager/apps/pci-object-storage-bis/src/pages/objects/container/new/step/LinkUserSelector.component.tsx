import {
  OdsButton,
  OdsFormField,
  OdsSelect,
  OdsSpinner,
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
  userId: number;
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
  const formUser = listUsers?.find((user) => user.id === userId);

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

  useEffect(() => {
    if (formUser?.s3Credentials) {
      showSecretKey();
    }
  }, [formUser]);

  const onShowCredentials = async () => {
    if (!formUser?.s3Credentials) {
      const credentials = await generateS3Credentials(projectId, formUser?.id);
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
        <div className="flex">
          <OdsSelect
            className="min-w-[35rem]"
            key={`select-users-${listUsers?.length}`}
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
            customRenderer={{
              option: (data) => {
                return `<div style="display: flex; justify-content: space-between; align-items: center;">
                          <p style="font-size: 16px; margin: 0;">${data?.text}</p>
                          <p style="font-size: 12px; margin: 0;">${data?.hint}</p>
                        </div>`;
              },
            }}
          >
            {listUsers?.map((user) => (
              <option
                key={user?.id}
                value={user?.id}
                data-hint={tAssociateUser(
                  user?.s3Credentials
                    ? 'pci_projects_project_storages_containers_add_create_or_linked_user_linked_user_has_credential'
                    : 'pci_projects_project_storages_containers_add_create_or_linked_user_linked_user_has_not_credential',
                )}
              >
                {user?.description
                  ? `${user?.username} -  ${user?.description}`
                  : user?.username}
              </option>
            ))}
          </OdsSelect>

          {isPendingListUsers && (
            <OdsSpinner size="sm" className="ml-6 align-center" />
          )}
        </div>
      </OdsFormField>
      <div>
        {haveShowedOrGeneratedCredentials && (
          <UserInformationTile
            secretUser={secretUser}
            user={formUser}
            onClose={() => setHaveShowedOrGeneratedCredentials(false)}
          />
        )}
      </div>
      <div className="mt-6 flex gap-4">
        <OdsButton
          onClick={onCancel}
          variant="ghost"
          size="sm"
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
          size="sm"
          isDisabled={isDisabled}
          onClick={onShowCredentials}
        />
      </div>
    </>
  );
}
