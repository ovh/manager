import { useTranslation } from 'react-i18next';
import { useLocation, useMatch, useResolvedPath } from 'react-router-dom';
import { ROUTE_PATHS } from '@/routes';

export function useTabs() {
  const { t } = useTranslation('cold-archive');
  const { pathname: currentPath } = useLocation();
  const { pathname: storagePath } = useResolvedPath(ROUTE_PATHS.STORAGES);
  const { pathname: userListPath } = useResolvedPath(ROUTE_PATHS.USER_LIST);

  const isUserSubroute = Boolean(
    useMatch({
      path: `${ROUTE_PATHS.ROOT}/${ROUTE_PATHS.USER_LIST}/*`,
      end: false,
    }),
  );

  return {
    tabs: [
      {
        name: 'pci_projects_project_storages_cold_archive_label',
        title: t(
          'pci_projects_project_storages_cold_archive_tabs_tab_archives',
        ),
        to: storagePath,
      },
      {
        name: 'pci_projects_project_storages_cold_archive_tabs_tab_users',
        title: t('pci_projects_project_storages_cold_archive_tabs_tab_users'),
        to: isUserSubroute ? currentPath : userListPath,
      },
    ],
    isUserTabSelected: isUserSubroute,
  };
}
