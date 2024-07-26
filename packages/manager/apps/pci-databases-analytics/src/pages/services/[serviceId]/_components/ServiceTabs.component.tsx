import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import * as database from '@/types/cloud/project/database';
import { useUserActivityContext } from '@/contexts/UserActivityContext';
import { POLLING } from '@/configuration/polling.constants';
import TabsMenu from '@/components/tabs-menu/TabsMenu.component';
import { useGetUsers } from '@/hooks/api/database/user/useGetUsers.hook';
import { useGetBackups } from '@/hooks/api/database/backup/useGetBackups.hook';
import { useGetDatabases } from '@/hooks/api/database/database/useGetDatabases.hook';
import { useGetConnectionPools } from '@/hooks/api/database/connectionPool/useGetConnectionPools.hook';
import { useGetIntegrations } from '@/hooks/api/database/integration/useGetIntegrations.hook';
import { useGetNamespaces } from '@/hooks/api/database/namespace/useGetNamespaces.hook';
import { useGetCurrentQueries } from '@/hooks/api/database/query/useGetCurrentQueries.hook';

interface ServiceTabsProps {
  service: database.Service;
}
const ServiceTabs = ({ service }: ServiceTabsProps) => {
  const { projectId } = useParams();
  const { t } = useTranslation('pci-databases-analytics/services/service');
  const { isUserActive } = useUserActivityContext();

  const { data: users } = useGetUsers(projectId, service.engine, service.id, {
    refetchInterval: isUserActive && POLLING.USERS,
    enabled: !!service.capabilities.users?.read,
  });
  const { data: backups } = useGetBackups(
    projectId,
    service.engine,
    service.id,
    {
      refetchInterval: isUserActive && POLLING.BACKUPS,
      enabled: !!service.capabilities.backups?.read,
    },
  );
  const { data: databases } = useGetDatabases(
    projectId,
    service.engine,
    service.id,
    {
      refetchInterval: isUserActive && POLLING.DATABASES,
      enabled: !!service.capabilities.databases?.read,
    },
  );
  const { data: namespaces } = useGetNamespaces(
    projectId,
    service.engine,
    service.id,
    {
      refetchInterval: isUserActive && POLLING.NAMESPACES,
      enabled: !!service.capabilities.namespaces?.read,
    },
  );
  const { data: connectionPools } = useGetConnectionPools(
    projectId,
    service.engine,
    service.id,
    {
      refetchInterval: isUserActive && POLLING.POOLS,
      enabled: !!service.capabilities.connectionPools?.read,
    },
  );
  const { data: currentQueries } = useGetCurrentQueries(
    projectId,
    service.engine,
    service.id,
    {
      refetchInterval: isUserActive && POLLING.CURRENT_QUERIES,
      enabled: !!service.capabilities.currentQueries?.read,
    },
  );
  const { data: integrations } = useGetIntegrations(
    projectId,
    service.engine,
    service.id,
    {
      refetchInterval: isUserActive && POLLING.INTEGRATIONS,
      enabled: !!service.capabilities.currentQueries?.read,
    },
  );

  const tabs = [
    { href: '', label: t('DashboardTab'), end: true },
    service.capabilities.users && {
      href: 'users',
      label: t('UsersTab'),
      count: users?.length,
      disabled: !service.capabilities.users.read,
    },
    service.capabilities.backups && {
      href: 'backups',
      label: t('BackupsTab'),
      count: backups?.length,
      disabled: !service.capabilities.backups.read,
    },
    service.capabilities.databases && {
      href: 'databases',
      label: t('DatabasesTab'),
      count: databases?.length,
      disabled: !service.capabilities.databases.read,
    },
    service.capabilities.namespaces && {
      href: 'namespaces',
      label: t('NamespacesTab'),
      count: namespaces?.length,
      disabled: !service.capabilities.namespaces.read,
    },
    service.capabilities.connectionPools && {
      href: 'pools',
      label: t('PoolsTab'),
      count: connectionPools?.length,
      disabled: !service.capabilities.connectionPools.read,
    },
    service.capabilities.queryStatistics && {
      href: 'queries',
      label: t('QueriesTab'),
      count: currentQueries?.length,
      disabled: !service.capabilities.queryStatistics.read,
    },
    service.capabilities.integrations && {
      href: 'integrations',
      label: t('IntegrationsTab'),
      count: integrations?.length,
      disabled: !service.capabilities.integrations.read,
    },
    { href: 'metrics', label: t('MetricsTab') },
    { href: 'logs', label: t('LogsTab') },
    { href: 'settings', label: t('SettingsTab') },
  ].filter((tab) => tab);

  return <TabsMenu tabs={tabs} />;
};

export default ServiceTabs;
