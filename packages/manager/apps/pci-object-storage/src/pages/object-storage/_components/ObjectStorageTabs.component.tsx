import { useTranslation } from 'react-i18next';
import TabsMenu from '@/components/tabs-menu/TabsMenu.component';
import { FormattedStorage } from '@/types/Storages';
import user from '@/types/User';

interface ObjectStorageTabsProps {
  storages: FormattedStorage[];
  users: user.User[];
}

const ObjectStorageTabs = ({ storages, users }: ObjectStorageTabsProps) => {
  const { t } = useTranslation('pci-object-storage');

  const tabs = [
    {
      href: '',
      count: storages.length,
      label: t('containerTab'),
      end: true,
    },
    {
      href: 'users',
      label: t('usersTab'),
      count: users.length,
    },
  ].filter((tab) => tab);

  return <TabsMenu tabs={tabs} />;
};

export default ObjectStorageTabs;
