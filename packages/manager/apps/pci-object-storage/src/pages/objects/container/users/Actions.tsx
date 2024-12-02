import { ApiError } from '@ovh-ux/manager-core-api';
import { ActionMenu, useNotifications } from '@ovh-ux/manager-react-components';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { useContext } from 'react';
import { Translation, useTranslation } from 'react-i18next';
import { useHref, useParams } from 'react-router-dom';
import { downloadContent } from '@/utils';
import { DOWNLOAD_FILENAME, DOWNLOAD_TYPE } from '@/constants';
import { usePostS3Secret } from '@/api/hooks/useUser';
import { getUserStoragePolicy, TUser } from '@/api/data/user';

export default function ActionsComponent({ user }: { user: TUser }) {
  const { t } = useTranslation('objects/users');
  const { t: tPciStoragesContainers } = useTranslation(
    'pci-storages-containers',
  );

  const { projectId } = useParams();
  const { addSuccess, addInfo, addError } = useNotifications();
  const { tracking } = useContext(ShellContext).shell;

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
                    secret: `<code class="text-break">${secret}</code>`,
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

  const deleteHref = useHref(`./${user.id}/delete`);
  const importHref = useHref(`./import-policy?userId=${user.id}`);
  const downloadRCloneHref = useHref(`./rclone/download?userId=${user.id}`);

  const items = [
    {
      id: 0,
      label: t('pci_projects_project_storages_containers_users_import_json'),
      href: importHref,
    },
    {
      id: 1,
      label: t('pci_projects_project_storages_containers_users_download_json'),
      onclick: downloadUserPolicyJson,
    },
    {
      id: 2,
      label: t(
        'pci_projects_project_storages_containers_users_download_rclone_file',
      ),
      href: downloadRCloneHref,
    },
    {
      id: 3,
      label: t('pci_projects_project_storages_containers_users_see_secret_key'),
      onclick: showSecretKey,
    },
    {
      id: 4,
      href: deleteHref,
      label: tPciStoragesContainers(
        'pci_projects_project_storages_containers_delete_label',
      ),
    },
  ];

  return <ActionMenu items={items} isCompact />;
}
