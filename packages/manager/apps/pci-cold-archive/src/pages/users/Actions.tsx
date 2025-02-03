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
import { v4 as uuidV4 } from 'uuid';
import { downloadContent } from '@/helpers';
import {
  COLD_ARCHIVE_TRACKING,
  DOWNLOAD_FILENAME,
  DOWNLOAD_TYPE,
} from '@/constants';
import { usePostS3Secret } from '@/api/hooks/useUsers';
import { getUserStoragePolicy, TUser } from '@/api/data/users';

export default function ActionsComponent({ user }: Readonly<{ user: TUser }>) {
  const { t } = useTranslation(['users', 'containers']);

  const { projectId } = useParams();
  const { addSuccess, addInfo, addError } = useNotifications();

  const navigate = useNavigate();

  const { tracking } = useContext(ShellContext).shell;

  const trackS3UsersPage = (action: string) => {
    tracking?.trackPage({
      name: `${COLD_ARCHIVE_TRACKING.USER.MAIN}::${action}`,
      action: 'navigation',
    });
  };

  const trackS3UsersClick = (action: string) => {
    tracking?.trackClick({
      name: `${COLD_ARCHIVE_TRACKING.USER.MAIN}::${action}`,
      type: 'action',
    });
  };

  const { postS3Secret: showSecretKey } = usePostS3Secret({
    projectId,
    userId: user.id,
    userAccess: user.access,
    onSuccess: ({ secret }) => {
      addInfo(
        <Translation ns="users">
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
        <Translation ns="users">
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
    trackS3UsersClick(COLD_ARCHIVE_TRACKING.USER.ACTIONS.DOWNLOAD_POLICY);
    getUserStoragePolicy(projectId, user?.id)
      .then(({ policy }) => {
        trackS3UsersPage(
          `${COLD_ARCHIVE_TRACKING.USER.ACTIONS.DOWNLOAD_POLICY}_${COLD_ARCHIVE_TRACKING.STATUS.SUCCESS}`,
        );
        downloadContent({
          fileContent: policy,
          fileName: DOWNLOAD_FILENAME,
          downloadType: DOWNLOAD_TYPE,
        });

        addSuccess(
          <Translation ns="users">
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
      .catch((error: ApiError) => {
        trackS3UsersPage(
          `${COLD_ARCHIVE_TRACKING.USER.ACTIONS.DOWNLOAD_POLICY}_${COLD_ARCHIVE_TRACKING.STATUS.ERROR}`,
        );
        addError(
          <Translation ns="users">
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
        );
      });
  };

  const items: ActionMenuItem[] = [
    {
      id: 0,
      label: t('pci_projects_project_storages_containers_users_import_json'),
      onClick: () => {
        trackS3UsersClick(COLD_ARCHIVE_TRACKING.USER.ACTIONS.IMPORT_POLICY);
        navigate(`./import-policy?userId=${user.id}`);
      },
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
      onClick: () => {
        trackS3UsersClick(COLD_ARCHIVE_TRACKING.USER.ACTIONS.DOWNLOAD_RCLONE);
        navigate(`./rclone/download?userId=${user.id}`);
      },
    },
    {
      id: 3,
      label: t('pci_projects_project_storages_containers_users_see_secret_key'),
      onClick: () => {
        trackS3UsersClick(COLD_ARCHIVE_TRACKING.USER.ACTIONS.DISPLAY_SECRET);
        window.scrollTo(0, 0);
        showSecretKey();
      },
    },
    {
      id: 4,
      label: t(
        'containers:pci_projects_project_storages_containers_delete_label',
      ),
      onClick: () => {
        trackS3UsersClick(COLD_ARCHIVE_TRACKING.USER.ACTIONS.DELETE_POLICY);
        navigate(`./${user.id}/delete`);
      },
    },
  ];

  return <ActionMenu id={uuidV4()} items={items} isCompact />;
}
