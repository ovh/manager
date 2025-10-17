import { useTranslation } from 'react-i18next';
import {
  OdsFormField,
  OdsMessage,
  OdsPassword,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { Clipboard } from '@ovh-ux/manager-react-components';
import LabelComponent from '@/components/Label.component';
import { TUser } from '@/api/data/user';

type UserInformationTileProps = {
  secretUser: string;
  user: TUser;
  onClose?: () => void;
};

export default function UserInformationTile({
  secretUser,
  user,
  onClose,
}: Readonly<UserInformationTileProps>) {
  const { t } = useTranslation(['credential-banner', 'pci-common']);
  return (
    <OdsMessage
      color="success"
      className="w-full my-6"
      onOdsRemove={() => onClose?.()}
    >
      <div className="w-full">
        <OdsText preset="paragraph" className="block mb-4">
          <span
            dangerouslySetInnerHTML={{
              __html: t(
                'pci_projects_project_storages_containers_add_linked_user_success_message',
                {
                  username: `<strong>${user.username}</strong>`,
                },
              ),
            }}
          />
        </OdsText>

        <div className="grid grid-cols-2 gap-4">
          <OdsFormField>
            <LabelComponent
              text={t(
                'pci_projects_project_storages_containers_add_create_or_linked_user_create_user_success_username_label',
              )}
            />
            <Clipboard className="w-[100%]" value={user.username} />
          </OdsFormField>

          <OdsFormField>
            <LabelComponent
              text={t(
                'pci_projects_project_storages_containers_add_create_or_linked_user_create_user_success_access-key_label',
              )}
            />
            <Clipboard
              className="w-[100%]"
              value={user.s3Credentials?.access}
            />
          </OdsFormField>

          <OdsFormField>
            <LabelComponent
              text={t(
                'pci_projects_project_storages_containers_add_create_or_linked_user_create_user_success_description_label',
              )}
            />
            <Clipboard className="w-[100%]" value={user.description} />
          </OdsFormField>

          <OdsFormField>
            <LabelComponent
              text={t(
                'pci_projects_project_storages_containers_add_create_or_linked_user_create_user_success_secret-key_label',
              )}
            />
            <OdsPassword
              className="w-[100%]"
              name="secretKey"
              value={secretUser}
              color="primary"
            />
          </OdsFormField>
        </div>
      </div>
    </OdsMessage>
  );
}
