import { useTranslation } from 'react-i18next';
import {
  OdsCard,
  OdsClipboard,
  OdsFormField,
  OdsPassword,
  OdsText,
} from '@ovhcloud/ods-components/react';
import LabelComponent from '@/components/Label.component';
import { TUser } from '@/api/data/user';

type UserInformationTileProps = {
  secretUser: string;
  user: TUser;
};
export default function UserInformationTile({
  secretUser,
  user,
}: Readonly<UserInformationTileProps>) {
  const { t } = useTranslation(['credential-banner', 'pci-common']);
  return (
    <OdsCard className="mt-8 bg-[var(--ods-color-success-100)] w-full">
      <OdsText
        preset="paragraph"
        className="block text-[var(--ods-color-success-500)]"
      >
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
      <div className="flex justify-between mt-6">
        <OdsFormField className="w-[45%]">
          <LabelComponent
            text={t(
              'pci_projects_project_storages_containers_add_create_or_linked_user_create_user_success_username_label',
            )}
          ></LabelComponent>
          <OdsClipboard value={user.username}>
            <span slot="success-message">
              {t('pci-common:common_clipboard_copied')}
            </span>
          </OdsClipboard>
        </OdsFormField>
        <OdsFormField className="w-[45%]">
          <LabelComponent
            text={t(
              'pci_projects_project_storages_containers_add_create_or_linked_user_create_user_success_access-key_label',
            )}
          ></LabelComponent>
          <OdsClipboard value={user.s3Credentials?.access}>
            <span slot="success-message">
              {t('pci-common:common_clipboard_copied')}
            </span>
          </OdsClipboard>
        </OdsFormField>
      </div>
      <div className="flex mt-8 justify-between">
        <OdsFormField className="w-[45%]">
          <LabelComponent
            text={t(
              'pci_projects_project_storages_containers_add_create_or_linked_user_create_user_success_description_label',
            )}
          ></LabelComponent>
          <OdsClipboard value={user.description}>
            <span slot="success-message">
              {t('pci-common:common_clipboard_copied')}
            </span>
          </OdsClipboard>
        </OdsFormField>
        <OdsFormField className="w-[45%]">
          <LabelComponent
            text={t(
              'pci_projects_project_storages_containers_add_create_or_linked_user_create_user_success_secret-key_label',
            )}
          ></LabelComponent>
          <OdsPassword name="secretKey" value={secretUser} color="primary" />
        </OdsFormField>
      </div>
    </OdsCard>
  );
}
