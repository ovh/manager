import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import * as role from '@datatr-ux/ovhcloud-types/cloud/role/index';
import user from '@/types/User';
import TabsMenu from '@/components/tabs-menu/TabsMenu.component';
import { useUserActivityContext } from '@/contexts/UserActivityContext';
import { POLLING } from '@/configuration/polling.constants';
import { useGetUsers } from '@/data/hooks/user/useGetUsers.hook';
import { useGetStorages } from '@/data/hooks/storage/useGetStorages.hook';

const ObjectStorageTabs = () => {
  const { projectId } = useParams();
  const { t } = useTranslation('pci-object-storage');
  const { isUserActive } = useUserActivityContext();

  const { data: users } = useGetUsers(projectId, {
    refetchInterval: isUserActive && POLLING.USERS,
  });

  const containersQuery = useGetStorages(projectId, {
    refetchInterval: isUserActive && POLLING.CONTAINERS,
  });

  const tabs = [
    {
      href: '',
      count: containersQuery.data?.resources?.length,
      label: t('containerTab'),
      end: true,
    },
    {
      href: 'users',
      label: t('usersTab'),
      count:
        users?.filter(
          (us: user.User) =>
            us.status === user.UserStatusEnum.creating ||
            us.roles.find(
              (s3Role: role.Role) =>
                s3Role.name === user.RoleEnum.objectstore_operator,
            ),
        ).length || 0,
    },
  ].filter((tab) => tab);

  return <TabsMenu tabs={tabs} />;
};

export default ObjectStorageTabs;
