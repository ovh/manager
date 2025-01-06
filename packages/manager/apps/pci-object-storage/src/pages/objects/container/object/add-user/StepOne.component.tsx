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
  const { t } = useTranslation('pci-storages-containers-object-add-user');
  return (
    <>
      <OdsText>
        {t(
          'pci_projects_project_storages_containers_container_addUser_description_object_step_0',
        )}
      </OdsText>
      <OdsFormField className="mt-4">
        <LabelComponent
          text={t(
            'pci_projects_project_storages_containers_container_addUser_select_user_label',
          )}
        />
        <OdsSelect
          value={selectedUser?.id}
          onOdsChange={(event) => {
            const user = users.find((u) => u.id === event.detail.value);
            onSelectUser(user);
          }}
          name={'userSelect'}
        >
          {selectedUser?.description ? (
            <OdsText slot="selectedLabel">
              {selectedUser?.username} - {selectedUser?.description}
            </OdsText>
          ) : (
            <OdsText slot="selectedLabel">{selectedUser?.username}</OdsText>
          )}

          {/* TODO select option */}
          {users?.map((user) => {
            return (
              <div key={user.id}>
                {user?.description ? (
                  <OdsText className="mr-48">
                    {user?.username} - {user?.description}
                  </OdsText>
                ) : (
                  <OdsText className="mr-48">{user?.username}</OdsText>
                )}
                <OdsText>
                  {t(
                    user.s3Credentials
                      ? 'pci_projects_project_storages_containers_container_addUser_select_user_has_credential'
                      : 'pci_projects_project_storages_containers_container_addUser_select_user_has_not_credential',
                  )}
                </OdsText>
              </div>
            );
          })}
        </OdsSelect>
      </OdsFormField>
    </>
  );
}
