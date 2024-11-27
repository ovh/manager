import { Translation, useTranslation } from 'react-i18next';
import { ActionMenu, useNotifications } from '@ovh-ux/manager-react-components';
import { useHref, useParams } from 'react-router-dom';
import { ApiError } from '@ovh-ux/manager-core-api';
import { useContext } from 'react';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { getUserStoragePolicy, TUser } from '@/api/data/user';
import { DOWNLOAD_FILENAME, DOWNLOAD_TYPE } from '@/constants';
import { downloadContent } from '@/utils';

export default function ActionsComponent({ user }: { user: TUser }) {
  const { t } = useTranslation('objects/users');
  const { t: tPciStoragesContainers } = useTranslation(
    'pci-storages-containers',
  );

  const { projectId } = useParams();
  const { addSuccess, addError } = useNotifications();
  const { tracking } = useContext(ShellContext).shell;

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

  const items = [
    {
      id: 0,
      label: t('pci_projects_project_storages_containers_users_import_json'),
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
    },
    {
      id: 3,
      label: t('pci_projects_project_storages_containers_users_see_secret_key'),
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
