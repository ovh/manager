import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGetTokens } from '@/hooks/api/token-api/useGetTokens';
import { useGetUsers } from '@/hooks/api/user-api/useGetUsers';
import { useGetRegistries } from '@/hooks/api/registry-api/useGetRegistries';
import { useGetDatastores } from '@/hooks/api/datastore-api/useGetDatastores';
import TabsMenu from '@/components/tabs-menu/TabsMenu.component';

const DashboardTabs = () => {
  const { projectId } = useParams();
  const { t } = useTranslation('test');

  const { data: users } = useGetUsers(projectId, {
    // refetchInterval: POLLING.SERVICE,
  });

  const { data: tokens } = useGetTokens(projectId, {
    // refetchInterval:
  });

  const { data: registries } = useGetRegistries(projectId, {
    // refetchInverval: POLLING,
  });

  const { data: datastores } = useGetDatastores(projectId, 'GRA', {
    // refetchInverval: POLLING,
  });

  const tabs = [
    { href: '', label: 'Dashboard', end: true },
    {
      href: 'users-tokens',
      label: 'Users & tokens',
      count: users?.length + tokens?.length,
    },
    {
      href: 'registries',
      label: 'Docker Registries',
      count: registries?.length,
    },
    { href: 'cli', label: 'Command Line Interface' },
    { href: 'datastore', label: 'Datastore', count: datastores?.length },
  ].filter((tab) => tab);

  return <TabsMenu tabs={tabs} />;
};

export default DashboardTabs;
