import { useResolvedPath } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { TabsPanel } from '@ovh-ux/manager-pci-common';
import { urls } from '@/routes/routes.constant';

export default function Navigation() {
  const { t } = useTranslation(['home', 'settings', 'common']);

  const { pathname: home } = useResolvedPath(urls.home);
  const { pathname: settings } = useResolvedPath(urls.edit);

  const tabs = [
    {
      name: 'home',
      title: t('home:name'),
      to: home,
    },
    {
      name: 'settings',
      title: t('settings:name'),
      to: settings,
    },
  ];

  return (
    <nav aria-label={t('common:main_navigation')}>
      <TabsPanel tabs={tabs} />
    </nav>
  );
}
