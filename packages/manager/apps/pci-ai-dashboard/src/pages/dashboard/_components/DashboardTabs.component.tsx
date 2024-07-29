import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useGetTokens } from '@/hooks/api/ai/token/useGetTokens.hook';
import { useGetUsers } from '@/hooks/api/user/useGetUsers.hook';
import { useGetRegistries } from '@/hooks/api/ai/registry/useGetRegistries.hook';
import { useGetDatastores } from '@/hooks/api/ai/datastore/useGetDatastores.hook';
import TabsMenu from '@/components/tabs-menu/TabsMenu.component';
import { user } from '@/types/user';
import { POLLING } from '@/configuration/polling';

const DashboardTabs = () => {
  const { projectId } = useParams();
  const { t } = useTranslation('pci-ai-dashboard');

  const { data: users } = useGetUsers(projectId, {
    refetchInterval: POLLING.USERS,
  });

  const { data: tokens } = useGetTokens(projectId, {
    refetchInterval: POLLING.TOKEN,
  });

  const { data: registries } = useGetRegistries(projectId, {
    refetchInterval: POLLING.DOCKER,
  });

  const { data: datastores } = useGetDatastores(projectId, 'GRA', {
    refetchInterval: POLLING.DATASTORE,
  });

  const tabs = [
    { href: '', label: t('homeTab'), end: true },
    {
      href: 'users',
      label: t('usersTab'),
      count:
        users?.filter((us: user.User) =>
          us.roles.find(
            (role: user.Role) =>
              role.name === user.AIUserRoleEnum.ai_training_operator ||
              role.name === user.AIUserRoleEnum.ai_training_read,
          ),
        ).length || 0,
    },
    {
      href: 'tokens',
      label: t('tokensTab'),
      count: tokens?.length || 0,
    },
    {
      href: 'registries',
      label: t('dockerRegistriesTab'),
      count: registries?.length || 0,
    },
    {
      href: 'registries',
      label: t('githubRegistriesTab'),
      count: registries?.length || 0,
    },
    { href: 'datastore', label: t('datastoreTab'), count: datastores?.length },
  ].filter((tab) => tab);

  return <TabsMenu tabs={tabs} />;
};

export default DashboardTabs;
