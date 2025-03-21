import { Clipboard } from '@ovh-ux/manager-react-components';
import { OdsFormField, OdsPassword } from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import LabelComponent from '@/components/Label.component';
import { useTracking } from '@/hooks/useTracking';
import { COLD_ARCHIVE_TRACKING } from '@/tracking.constants';

type UserInformationTileProps = {
  title: JSX.Element;
  username: string;
  description: string;
  accessKey: string;
  secret: string;
  trackingPrefix: string;
};

export default function UserInformationTile({
  title,
  username,
  description,
  accessKey,
  secret,
  trackingPrefix,
}: Readonly<UserInformationTileProps>) {
  const { t } = useTranslation(['users/credentials', 'pci-common']);

  const { trackCopyClipboardClick } = useTracking(trackingPrefix);

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
          <Clipboard
            className="w-full"
            value={username}
            onOdsCopy={() =>
              trackCopyClipboardClick(COLD_ARCHIVE_TRACKING.CLIPBOARD_INFO.NAME)
            }
          />
        </OdsFormField>

        <OdsFormField>
          <LabelComponent
            text={t(
              'pci_projects_project_storages_containers_add_create_or_linked_user_create_user_success_access-key_label',
            )}
          />
          <Clipboard
            className="w-full"
            value={accessKey}
            onOdsCopy={() =>
              trackCopyClipboardClick(
                COLD_ARCHIVE_TRACKING.CLIPBOARD_INFO.ACCESS_KEY,
              )
            }
          />
        </OdsFormField>

        <OdsFormField>
          <LabelComponent
            text={t(
              'pci_projects_project_storages_containers_add_create_or_linked_user_create_user_success_description_label',
            )}
          />
          <Clipboard
            className="w-full"
            value={description}
            onOdsCopy={() =>
              trackCopyClipboardClick(
                COLD_ARCHIVE_TRACKING.CLIPBOARD_INFO.DESCRIPTION,
              )
            }
          />
        </OdsFormField>

        <OdsFormField>
          <LabelComponent
            text={t(
              'pci_projects_project_storages_containers_add_create_or_linked_user_create_user_success_secret-key_label',
            )}
          />
          {/* Ods clipboard doesn't currently allows input of type password */}
          {/* @TODO refactor when clipboard allows password input types */}
          <div className="flex">
            <div className="flex-1">
              <OdsPassword
                className="w-[100%]"
                name="secret"
                value={secret}
                isReadonly
              />
            </div>
            <Clipboard
              className="w-[2rem]"
              value={secret}
              onOdsCopy={() =>
                trackCopyClipboardClick(
                  COLD_ARCHIVE_TRACKING.CLIPBOARD_INFO.SECRET_KEY,
                )
              }
            />
          </div>
        </OdsFormField>
      </div>
    </div>
  );
}
