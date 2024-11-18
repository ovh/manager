import { TabsPanel } from '@ovh-ux/manager-pci-common';
import { useTranslation } from 'react-i18next';
import { Outlet, useResolvedPath } from 'react-router-dom';
import { ROUTE_PATHS } from '@/routes';

export default function QuotaTabs() {
  const { t } = useTranslation(['regions', 'quotas']);

  const tabs = [
    {
      name: 'quota',
      title: t('pci_projects_project_quota', { ns: 'quotas' }),
      to: useResolvedPath(ROUTE_PATHS.QUOTA).pathname,
    },
    {
      name: 'regions',
      title: t('pci_projects_project_regions', { ns: 'regions' }),
      to: useResolvedPath(ROUTE_PATHS.REGIONS).pathname,
    },
  ];

  return (
    <div>
      <TabsPanel tabs={tabs} />
      <Outlet />
    </div>
  );
}
