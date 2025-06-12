import { ApiError } from '@ovh-ux/manager-core-api';
import {
  ActionMenu,
  ActionMenuItem,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useContext } from 'react';
import { Translation, useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { downloadContent } from '@/utils';
import { DOWNLOAD_FILENAME, DOWNLOAD_TYPE } from '@/constants';
import { usePostS3Secret } from '@/api/hooks/useUser';
import { getUserStoragePolicy, TUser } from '@/api/data/user';

export default function ActionsComponent({ user }: Readonly<{ user: TUser }>) {
  const { t } = useTranslation('objects/users');
  const { t: tContainers } = useTranslation('containers');

  const { projectId } = useParams();
  const { addSuccess, addInfo, addError } = useNotifications();
  const { tracking } = useContext(ShellContext).shell;

  const navigate = useNavigate();

  const { postS3Secret: showSecretKey } = usePostS3Secret({
    projectId,
    userId: user.id,
    userAccess: user.access,
    onSuccess: ({ secret }) => {
      addInfo(
        <Translation ns="objects/users">
          {(_t) => (
            <span
              dangerouslySetInnerHTML={{
                __html: _t(
                  'pci_projects_project_storages_containers_users_show_secret_key_success',
                  {
                    user: `<strong>${user.username}</strong>`,
                    secret: `<span style="color: var(--ods-color-critical-600); background: var(--ods-color-critical-050)">${secret}</span>`,
                  },
                ),
              }}
            />
          )}
        </Translation>,
        true,
      );
    },
    onError: (error: ApiError) => {
      addError(
        <Translation ns="objects/users">
          {(_t) => (
            <span
              dangerouslySetInnerHTML={{
                __html: _t(
                  'pci_projects_project_storages_containers_users_show_secret_key_error',
                  {
                    user: `<strong>${user.username}</strong>`,
                    message:
                      error?.response?.data?.message || error?.message || null,
                  },
                ),
              }}
            />
          )}
        </Translation>,
        true,
      );
    },
  });

  const downloadUserPolicyJson = () => {
    tracking?.trackClick({
      name: 's3-policies-users::download-json',
      type: 'action',
    });

    getUserStoragePolicy(projectId, user?.id)
      .then(({ policy }) => {
        downloadContent({
          fileContent: policy,
          fileName: DOWNLOAD_FILENAME,
          downloadType: DOWNLOAD_TYPE,
        });

        addSuccess(
          <Translation ns="objects/users">
            {(_t) =>
              _t(
                'pci_projects_project_storages_containers_users_import_success_message',
                { user: user.username },
              )
            }
          </Translation>,
          true,
        );
      })
      .catch((error: ApiError) =>
        addError(
          <Translation ns="objects/users">
            {(_t) =>
              _t(
                'pci_projects_project_storages_containers_users_import_error_message',
                {
                  message:
                    error?.response?.data?.message || error?.message || null,
                },
              )
            }
          </Translation>,
          true,
        ),
      );
  };

  const items: ActionMenuItem[] = [
    {
      id: 0,
      label: t('pci_projects_project_storages_containers_users_import_json'),
      onClick: () => navigate(`./import-policy?userId=${user.id}`),
    },
    {
      id: 1,
      label: t('pci_projects_project_storages_containers_users_download_json'),
      onClick: downloadUserPolicyJson,
    },
    {
      id: 2,
      label: t(
        'pci_projects_project_storages_containers_users_download_rclone_file',
      ),
      onClick: () => navigate(`./rclone/download?userId=${user.id}`),
    },
    {
      id: 3,
      label: t('pci_projects_project_storages_containers_users_see_secret_key'),
      onClick: showSecretKey,
    },
    {
      id: 4,
      label: tContainers(
        'pci_projects_project_storages_containers_delete_label',
      ),
      onClick: () => navigate(`./${user.id}/delete`),
    },
  ];

  return (
    <ActionMenu
      id={user.id.toString()}
      items={items}
      isCompact
      variant={ODS_BUTTON_VARIANT.ghost}
    />
  );
}
