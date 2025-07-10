import { useResolvedPath } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { urls } from '@/routes/routes.constant';

export function useTabs() {
  const { t } = useTranslation('project');

  const { pathname: homePath } = useResolvedPath(urls.home);
  const { pathname: editPath } = useResolvedPath(urls.edit);

  return {
    tabs: [
      {
        name: 'home',
        title: t('pci_projects_project_home'),
        to: homePath,
      },
      {
        name: 'settings',
        title: t('pci_projects_project_parameters'),
        to: editPath,
      },
    ],
  };
}
