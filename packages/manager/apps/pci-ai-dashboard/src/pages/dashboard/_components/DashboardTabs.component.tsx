import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import { useGetTokens } from '@/hooks/api/ai/token/useGetTokens.hook';
import { useGetUsers } from '@/hooks/api/user/useGetUsers.hook';
import { useGetRegistries } from '@/hooks/api/ai/registry/useGetRegistries.hook';
import TabsMenu from '@/components/tabs-menu/TabsMenu.component';
import * as user from '@/types/cloud/user';
import { POLLING } from '@/configuration/polling';
import { useGetDatastoresWithRegions } from '@/hooks/api/ai/datastore/useGetDatastoresWithRegions.hook';
import * as ai from '@/types/cloud/project/ai';
import * as role from '@/types/cloud/role';
import { useGetRegions } from '@/hooks/api/ai/capabilities/useGetRegions.hook';

const DashboardTabs = () => {
  const { projectId } = useParams();
  const { t } = useTranslation('pci-ai-dashboard');
  const [regions, setRegions] = useState<ai.capabilities.Region[]>([]);
  const regionQuery = useGetRegions(projectId);

  useEffect(() => {
    if (!regionQuery.data) return;
    setRegions(regionQuery.data);
  }, [regionQuery.isSuccess]);

  const { data: users } = useGetUsers(projectId, {
    refetchInterval: POLLING.USERS,
  });

  const { data: tokens } = useGetTokens(projectId, {
    refetchInterval: POLLING.TOKEN,
  });

  const { data: registries } = useGetRegistries(projectId, {
    refetchInterval: POLLING.DOCKER,
  });

  const { data: datastores } = useGetDatastoresWithRegions(projectId, regions, {
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
            (aiRole: role.Role) =>
              aiRole.name === ai.TokenRoleEnum.ai_training_operator ||
              aiRole.name === ai.TokenRoleEnum.ai_training_read,
          ),
        ).length || 0,
    },
    {
      href: 'tokens',
      label: t('tokensTab'),
      count: tokens?.length || 0,
    },
    {
      href: 'docker-registries',
      label: t('dockerRegistriesTab'),
      count: registries?.length || 0,
    },
    {
      href: 'git-registries',
      label: t('githubRegistriesTab'),
      count: datastores?.filter((ds) => ds.type === ai.DataStoreTypeEnum.git)
        .length,
    },
    {
      href: 'datastore',
      label: t('datastoreTab'),
      count: datastores?.filter((ds) => ds.type === ai.DataStoreTypeEnum.s3)
        .length,
    },
  ].filter((tab) => tab);

  return <TabsMenu tabs={tabs} />;
};

export default DashboardTabs;
