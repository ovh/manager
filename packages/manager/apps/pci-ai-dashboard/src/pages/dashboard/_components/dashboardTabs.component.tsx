import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGetTokens } from '@/hooks/api/ai/token/useGetTokens.hook';
import { useGetUsers } from '@/hooks/api/user/useGetUsers.hook';
import { useGetRegistries } from '@/hooks/api/ai/registry/useGetRegistries.hook';
import { useGetDatastores } from '@/hooks/api/ai/datastore/useGetDatastores.hook';
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
      href: 'users',
      label: 'Users',
      count: users?.length,
    },
    {
      href: 'tokens',
      label: 'Tokens',
      count: tokens?.length,
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
