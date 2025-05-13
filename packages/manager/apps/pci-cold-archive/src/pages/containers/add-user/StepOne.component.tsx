import { useTranslation } from 'react-i18next';
import {
  OdsFormField,
  OdsSelect,
  OdsText,
} from '@ovhcloud/ods-components/react';
import LabelComponent from '@/components/Label.component';
import { TUser } from '@/api/data/users';

type StepOneComponentProps = {
  onSelectUser: (user: TUser) => void;
  defaultUser: TUser;
  selectedUser: TUser;
  users: TUser[];
};

export default function StepOneComponent({
  onSelectUser,
  defaultUser,
  selectedUser,
  users,
}: Readonly<StepOneComponentProps>) {
  const { t } = useTranslation('containers/add-user');

  return (
    <div data-testid="addUser_stepOne">
      <OdsText>
        {t(
          'pci_projects_project_storages_coldArchive_containers_addUser_description_container_step_0',
        )}
      </OdsText>

      <OdsFormField className="my-4 w-full">
        <LabelComponent
          text={t(
            'pci_projects_project_storages_coldArchive_containers_addUser_select_user_label',
          )}
        />
        <OdsSelect
          data-testid="addUser-user_select"
          value={selectedUser ? `${selectedUser?.id}` : `${defaultUser?.id}`}
          onOdsChange={(event) => {
            const user = users.find((u) => `${u.id}` === event.detail.value);
            onSelectUser(user);
          }}
          name="userSelect"
          customRenderer={{
            option: (data) => {
              return `<div style="display: flex; justify-content: space-between; align-items: center;">
                        <p style="font-size: 16px; margin: 0; text-overflow: ellipsis; white-space: nowrap; overflow: hidden; width:70%">${data?.text}</p>
                        <p style="font-size: 12px; margin: 0;">${data.hint}</p>
                      </div>`;
            },
          }}
        >
          {users?.map((user) => (
            <option
              value={user?.id}
              key={user?.id}
              data-hint={t(
                user.s3Credentials
                  ? 'pci_projects_project_storages_coldArchive_containers_addUser_select_user_has_credential'
                  : 'pci_projects_project_storages_coldArchive_containers_addUser_select_user_has_not_credential',
              )}
            >
              {user?.description
                ? `${user?.username} -  ${user?.description}`
                : user.username}
            </option>
          ))}
        </OdsSelect>
      </OdsFormField>
    </div>
  );
}
