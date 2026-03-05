import { useTranslation } from 'react-i18next';
import * as database from '@/types/cloud/project/database';
import { useUserActivityContext } from '@/contexts/UserActivity.context';
import { POLLING } from '@/configuration/polling.constants';
import TabsMenu from '@/components/tabs-menu/TabsMenu.component';
import { useGetUsers } from '@/data/hooks/database/user/useGetUsers.hook';
import { useGetBackups } from '@/data/hooks/database/backup/useGetBackups.hook';
import { useGetDatabases } from '@/data/hooks/database/database/useGetDatabases.hook';
import { useGetConnectionPools } from '@/data/hooks/database/connectionPool/useGetConnectionPools.hook';
import { useGetIntegrations } from '@/data/hooks/database/integration/useGetIntegrations.hook';
import { useGetCurrentQueries } from '@/data/hooks/database/query/useGetCurrentQueries.hook';
import { useGetPatterns } from '@/data/hooks/database/pattern/useGetPatterns.hook';
import { useGetConnectors } from '@/data/hooks/database/connector/useGetConnectors.hook';
import { useGetReplications } from '@/data/hooks/database/replication/useGetReplications.hook';
import { useGetTopics } from '@/data/hooks/database/topic/useGetTopics.hook';
import { useGetTopicAcls } from '@/data/hooks/database/topicAcl/useGetTopicAcls.hook';
import { useServiceData } from '../Service.context';

interface ServiceTabsProps {
  service: database.Service;
}
const ServiceTabs = ({ service }: ServiceTabsProps) => {
  const { projectId } = useServiceData();
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
      enabled: !!service.capabilities.integrations?.read,
    },
  );
  const { data: replications } = useGetReplications(
    projectId,
    service.engine,
    service.id,
    {
      refetchInterval: isUserActive && POLLING.REPLICATIONS,
      enabled: !!service.capabilities.replication?.read,
    },
  );
  const { data: patterns } = useGetPatterns(
    projectId,
    service.engine,
    service.id,
    {
      refetchInterval: isUserActive && POLLING.PATTERNS,
      enabled: !!service.capabilities.patterns?.read,
    },
  );
  const { data: connectors } = useGetConnectors(
    projectId,
    service.engine,
    service.id,
    {
      refetchInterval: isUserActive && POLLING.CONNECTORS,
      enabled: !!service.capabilities.connector?.read,
    },
  );
  const { data: topics } = useGetTopics(projectId, service.engine, service.id, {
    refetchInterval: isUserActive && POLLING.TOPICS,
    enabled: !!service.capabilities.topic?.read,
  });
  const { data: topicAcls } = useGetTopicAcls(
    projectId,
    service.engine,
    service.id,
    {
      refetchInterval: isUserActive && POLLING.TOPIC_ACL,
      enabled: !!service.capabilities.topicAcl?.read,
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
    service.capabilities.topicAcl && {
      href: 'topicAcls',
      label: t('TopicAclsTab'),
      count: topicAcls?.length,
      disabled: !service.capabilities.topicAcl.read,
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
    service.capabilities.replication && {
      href: 'replications',
      label: t('ReplicationsTab'),
      count: replications?.length,
      disabled: !service.capabilities.replication.read,
    },
    service.capabilities.patterns && {
      href: 'indexPatterns',
      label: t('IndexPatternsTab'),
      count: patterns?.length,
      disabled: !service.capabilities.patterns.read,
    },
    service.capabilities.connector && {
      href: 'connectors',
      label: t('ConnectorsTab'),
      count: connectors?.length,
      disabled: !service.capabilities.connector.read,
    },
    service.capabilities.topic && {
      href: 'topics',
      label: t('TopicsTab'),
      count: topics?.length,
      disabled: !service.capabilities.topic.read,
    },
    { href: 'metrics', label: t('MetricsTab') },
    { href: 'logs', label: t('LogsTab') },
    { href: 'settings', label: t('SettingsTab') },
  ].filter((tab) => tab);

  return <TabsMenu tabs={tabs} />;
};

export default ServiceTabs;
