import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import {
  ODS_TEXT_LEVEL,
  ODS_TEXT_SIZE,
  OdsSelectValueChangeEvent,
} from '@ovhcloud/ods-components';
import {
  OsdsFormField,
  OsdsSelect,
  OsdsSelectOption,
  OsdsText,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
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
      <OsdsText
        level={ODS_TEXT_LEVEL.body}
        color={ODS_THEME_COLOR_INTENT.text}
        size={ODS_TEXT_SIZE._400}
      >
        {t(
          'pci_projects_project_storages_containers_container_addUser_description_object_step_0',
        )}
      </OsdsText>
      <OsdsFormField className="mt-4">
        <LabelComponent
          text={t(
            'pci_projects_project_storages_containers_container_addUser_select_user_label',
          )}
        />
        <OsdsSelect
          value={selectedUser?.id}
          onOdsValueChange={(event: OdsSelectValueChangeEvent) => {
            const user = users.find((u) => u.id === event.detail.value);
            onSelectUser(user);
          }}
        >
          {selectedUser?.description ? (
            <OsdsText
              level={ODS_TEXT_LEVEL.body}
              color={ODS_THEME_COLOR_INTENT.text}
              size={ODS_TEXT_SIZE._400}
              slot="selectedLabel"
            >
              {selectedUser?.username} - {selectedUser?.description}
            </OsdsText>
          ) : (
            <OsdsText
              level={ODS_TEXT_LEVEL.body}
              color={ODS_THEME_COLOR_INTENT.text}
              size={ODS_TEXT_SIZE._400}
              slot="selectedLabel"
            >
              {selectedUser?.username}
            </OsdsText>
          )}

          {users?.map((user) => (
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
                {t(
                  user.s3Credentials
                    ? 'pci_projects_project_storages_containers_container_addUser_select_user_has_credential'
                    : 'pci_projects_project_storages_containers_container_addUser_select_user_has_not_credential',
                )}
              </OsdsText>
            </OsdsSelectOption>
          ))}
        </OsdsSelect>
      </OsdsFormField>
    </>
  );
}

// pci_projects_project_storages_containers_container_addUser_select_user_has_credential
