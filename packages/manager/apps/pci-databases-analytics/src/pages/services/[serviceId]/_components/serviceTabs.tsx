import { useParams } from 'react-router-dom';
import { database } from '@/models/database';
import { useGetUsers } from '@/hooks/api/users.api.hooks';
import { useGetBackups } from '@/hooks/api/backups.api.hooks';
import { useGetDatabases } from '@/hooks/api/databases.api.hook';
import { useGetConnectionPools } from '@/hooks/api/connectionPool.api.hooks';
import { useGetCurrentQueries } from '@/hooks/api/queries.api.hooks';
import { useGetIntegrations } from '@/hooks/api/integrations.api.hook';
import { useGetNamespaces } from '@/hooks/api/namespaces.api.hooks';
import { POLLING } from '@/configuration/polling';
import TabsMenu from '@/components/tabs-menu';

interface ServiceTabsProps {
  service: database.Service;
}
const ServiceTabs = ({ service }: ServiceTabsProps) => {
  const { projectId } = useParams();
  const { data: users } = useGetUsers(projectId, service.engine, service.id, {
    refetchInterval: POLLING.SERVICE,
    enabled: !!service.capabilities.users?.read,
  });
  const { data: backups } = useGetBackups(
    projectId,
    service.engine,
    service.id,
    {
      refetchInterval: POLLING.SERVICE,
      enabled: !!service.capabilities.backups?.read,
    },
  );
  const { data: databases } = useGetDatabases(
    projectId,
    service.engine,
    service.id,
    {
      refetchInterval: POLLING.SERVICE,
      enabled: !!service.capabilities.databases?.read,
    },
  );
  const { data: namespaces } = useGetNamespaces(
    projectId,
    service.engine,
    service.id,
    {
      refetchInterval: POLLING.SERVICE,
      enabled: !!service.capabilities.namespaces?.read,
    },
  );
  const { data: connectionPools } = useGetConnectionPools(
    projectId,
    service.engine,
    service.id,
    {
      refetchInterval: POLLING.SERVICE,
      enabled: !!service.capabilities.connectionPools?.read,
    },
  );
  const { data: currentQueries } = useGetCurrentQueries(
    projectId,
    service.engine,
    service.id,
    {
      refetchInterval: POLLING.SERVICE,
      enabled: !!service.capabilities.currentQueries?.read,
    },
  );
  const { data: integrations } = useGetIntegrations(
    projectId,
    service.engine,
    service.id,
    {
      refetchInterval: POLLING.SERVICE,
      enabled: !!service.capabilities.currentQueries?.read,
    },
  );

  const tabs = [
    { href: '', label: 'Dashboard', end: true },
    service.capabilities.users && {
      href: 'users',
      label: 'Users',
      count: users?.length,
      disabled: !service.capabilities.users.read,
    },
    service.capabilities.backups && {
      href: 'backups',
      label: 'Backups',
      count: backups?.length,
      disabled: !service.capabilities.backups.read,
    },
    service.capabilities.databases && {
      href: 'databases',
      label: 'Databases',
      count: databases?.length,
      disabled: !service.capabilities.databases.read,
    },
    service.capabilities.namespaces && {
      href: 'namespaces',
      label: 'Namespaces',
      count: namespaces?.length,
      disabled: !service.capabilities.namespaces.read,
    },
    service.capabilities.connectionPools && {
      href: 'pools',
      label: 'Pools',
      count: connectionPools?.length,
      disabled: !service.capabilities.connectionPools.read,
    },
    service.capabilities.queryStatistics && {
      href: 'queries',
      label: 'Queries',
      count: currentQueries?.length,
      disabled: !service.capabilities.queryStatistics.read,
    },
    service.capabilities.integrations && {
      href: 'integrations',
      label: 'Integrations',
      count: integrations?.length,
      disabled: !service.capabilities.integrations.read,
    },
    { href: 'metrics', label: 'Metrics' },
    { href: 'logs', label: 'Logs' },
    { href: 'settings', label: 'Settings' },
  ].filter((t) => t);

  return <TabsMenu tabs={tabs} />;
};

export default ServiceTabs;
