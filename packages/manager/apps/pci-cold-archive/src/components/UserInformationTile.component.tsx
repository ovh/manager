import { Clipboard } from '@ovh-ux/manager-react-components';
import { OdsFormField, OdsPassword } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import LabelComponent from '@/components/Label.component';

type UserInformationTileProps = {
  title: JSX.Element;
  username: string;
  description: string;
  accessKey: string;
  secret: string;
};

export default function UserInformationTile({
  title,
  username,
  description,
  accessKey,
  secret,
}: Readonly<UserInformationTileProps>) {
  const { t } = useTranslation(['users/credentials', 'pci-common']);

  return (
    <div className="flex flex-col gap-4 w-full">
      {title}

      <div className="grid grid-cols-2 gap-4">
        <OdsFormField>
          <LabelComponent
            text={t(
              'pci_projects_project_storages_containers_add_create_or_linked_user_create_user_success_username_label',
            )}
          />
          <Clipboard className="w-full" value={username} />
        </OdsFormField>

        <OdsFormField>
          <LabelComponent
            text={t(
              'pci_projects_project_storages_containers_add_create_or_linked_user_create_user_success_access-key_label',
            )}
          />
          <Clipboard className="w-full" value={accessKey} />
        </OdsFormField>

        <OdsFormField>
          <LabelComponent
            text={t(
              'pci_projects_project_storages_containers_add_create_or_linked_user_create_user_success_description_label',
            )}
          />
          <Clipboard className="w-full" value={description} />
        </OdsFormField>

        <OdsFormField>
          <LabelComponent
            text={t(
              'pci_projects_project_storages_containers_add_create_or_linked_user_create_user_success_secret-key_label',
            )}
          />
          <OdsPassword
            className="w-full"
            name="secretKey"
            value={secret}
            color="primary"
          />
        </OdsFormField>
      </div>
    </div>
  );
}
