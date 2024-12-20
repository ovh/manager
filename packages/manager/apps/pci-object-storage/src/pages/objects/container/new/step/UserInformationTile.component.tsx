import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_TEXT_LEVEL, ODS_TEXT_SIZE } from '@ovhcloud/ods-components';
import {
  OsdsClipboard,
  OsdsFormField,
  OsdsPassword,
  OsdsText,
  OsdsTile,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
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
    <OsdsTile
      rounded
      color={ODS_THEME_COLOR_INTENT.success}
      inline
      className="mt-8 bg-[var(--ods-color-success-100)] w-full"
    >
      <OsdsText
        level={ODS_TEXT_LEVEL.body}
        size={ODS_TEXT_SIZE._400}
        color={ODS_THEME_COLOR_INTENT.success}
        className="block"
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
      </OsdsText>
      <div className="flex justify-between mt-6">
        <OsdsFormField className="w-[45%]">
          <LabelComponent
            text={t(
              'pci_projects_project_storages_containers_add_create_or_linked_user_create_user_success_username_label',
            )}
          ></LabelComponent>
          <OsdsClipboard value={user.username}>
            <span slot="success-message">
              {t('pci-common:common_clipboard_copied')}
            </span>
          </OsdsClipboard>
        </OsdsFormField>
        <OsdsFormField className="w-[45%]">
          <LabelComponent
            text={t(
              'pci_projects_project_storages_containers_add_create_or_linked_user_create_user_success_access-key_label',
            )}
          ></LabelComponent>
          <OsdsClipboard value={user.s3Credentials?.access}>
            <span slot="success-message">
              {t('pci-common:common_clipboard_copied')}
            </span>
          </OsdsClipboard>
        </OsdsFormField>
      </div>
      <div className="flex mt-8 justify-between">
        <OsdsFormField className="w-[45%]">
          <LabelComponent
            text={t(
              'pci_projects_project_storages_containers_add_create_or_linked_user_create_user_success_description_label',
            )}
          ></LabelComponent>
          <OsdsClipboard value={user.description}>
            <span slot="success-message">
              {t('pci-common:common_clipboard_copied')}
            </span>
          </OsdsClipboard>
        </OsdsFormField>
        <OsdsFormField className="w-[45%]">
          <LabelComponent
            text={t(
              'pci_projects_project_storages_containers_add_create_or_linked_user_create_user_success_secret-key_label',
            )}
          ></LabelComponent>
          <OsdsPassword
            value={secretUser}
            color={ODS_THEME_COLOR_INTENT.primary}
          />
        </OsdsFormField>
      </div>
    </OsdsTile>
  );
}
