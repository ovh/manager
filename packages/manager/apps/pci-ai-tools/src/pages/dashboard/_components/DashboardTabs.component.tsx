import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import * as role from '@datatr-ux/ovhcloud-types/cloud/role/index';
import ai from '@/types/AI';
import user from '@/types/User';
import { useGetTokens } from '@/data/hooks/ai/token/useGetTokens.hook';
import { useGetRegistries } from '@/data/hooks/ai/registry/useGetRegistries.hook';
import { useGetRegions } from '@/data/hooks/ai/capabilities/useGetRegions.hook';
import { useGetUsers } from '@/data/hooks/user/useGetUsers.hook';
import TabsMenu from '@/components/tabs-menu/TabsMenu.component';
import { useUserActivityContext } from '@/contexts/UserActivityContext';
import { POLLING } from '@/configuration/polling.constants';
import { useGetDatastoresWithRegions } from '@/data/hooks/ai/data/useGetDatastoresWithRegions.hook';

const DashboardTabs = () => {
  const { projectId } = useParams();
  const { t } = useTranslation('ai-tools/dashboard');
  const { isUserActive } = useUserActivityContext();
  const regionQuery = useGetRegions(projectId);
  const regions = regionQuery.data || [];

  const { data: users } = useGetUsers(projectId, {
    refetchInterval: isUserActive && POLLING.USERS,
  });

  const { data: tokens } = useGetTokens(projectId, {
    refetchInterval: isUserActive && POLLING.TOKEN,
  });

  const { data: registries } = useGetRegistries(projectId, {
    refetchInterval: isUserActive && POLLING.DOCKER,
  });

  const { data: datastores } = useGetDatastoresWithRegions(projectId, regions, {
    refetchInterval: isUserActive && POLLING.DATASTORE,
    enabled: !!regionQuery.data,
  });

  const tabs = [
    { href: '', label: t('homeTab'), end: true },
    {
      href: 'users',
      label: t('usersTab'),
      count:
        users?.filter(
          (us: user.User) =>
            us.status === user.UserStatusEnum.creating ||
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
