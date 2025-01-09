import { useTranslation } from 'react-i18next';
import {
  OdsFormField,
  OdsSelect,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { TUser } from '@/api/data/user';
import LabelComponent from '@/components/Label.component';

type StepOneComponentProps = {
  onSelectUser: (user: TUser) => void;
  selectedUser: TUser;
  users: TUser[];
};
export default function StepOneComponent({
  onSelectUser,
  selectedUser,
  users,
}: Readonly<StepOneComponentProps>) {
  const { t } = useTranslation('containers/add-user');

  return (
    <>
      <OdsText>
        {t(
          'pci_projects_project_storages_containers_container_addUser_description_object_step_0',
        )}
      </OdsText>

      <OdsFormField className="my-4 w-full">
        <LabelComponent
          text={t(
            'pci_projects_project_storages_containers_container_addUser_select_user_label',
          )}
        />
        <OdsSelect
          value={`${selectedUser?.id}`}
          onOdsChange={(event) => {
            const user = users.find((u) => u.id == event.detail.value);
            onSelectUser(user);
          }}
          name="userSelect"
        >
          {users?.map((user) => (
            <option
              value={user?.id}
              key={user?.id}
              className="flew justify-between"
            >
              <option>
                {user?.description
                  ? `${user?.username} -  ${user?.description}`
                  : user.username}
              </option>

              <option className="ml-48">
                {t(
                  user.s3Credentials
                    ? 'pci_projects_project_storages_containers_container_addUser_select_user_has_credential'
                    : 'pci_projects_project_storages_containers_container_addUser_select_user_has_not_credential',
                )}
              </option>
            </option>
          ))}
        </OdsSelect>
      </OdsFormField>
    </>
  );
}
