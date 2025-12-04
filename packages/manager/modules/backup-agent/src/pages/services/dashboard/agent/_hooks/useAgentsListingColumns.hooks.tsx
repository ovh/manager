import { useMemo } from 'react';

import { useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { BACKUP_AGENT_NAMESPACES } from '@/BackupAgent.translations';
import { ResourceStatusCell } from '@/components/CommonCells/ResourceStatusCell/ResourceStatusCell.component';
import { AgentCreatedAtDateCell } from '@/pages/services/dashboard/agent/_components/AgentCreatedAtDateCell.component';
import { Agent } from '@/types/Agent.type';
import { Resource } from '@/types/Resource.type';

import { AgentActionsCell, AgentIpsCell, AgentNameCell, AgentPolicyCell } from '../_components';

export function useAgentsListingColumnsHooks() {
  const { tenantId } = useParams();
  const { t } = useTranslation([
    BACKUP_AGENT_NAMESPACES.COMMON,
    NAMESPACES.DASHBOARD,
    NAMESPACES.SYSTEM,
    NAMESPACES.STATUS,
  ]);

  return useMemo(
    () => [
      {
        id: 'currentState.name',
        cell: (agentResource: Resource<Agent>) => (
          <AgentNameCell name={agentResource.currentState.name} />
        ),
        label: t(`${NAMESPACES.DASHBOARD}:name`),
      },
      {
        id: 'resourceStatus',
        cell: (agentResource: Resource<Agent>) => (
          <ResourceStatusCell resourceStatus={agentResource.resourceStatus} />
        ),
        label: t(`${NAMESPACES.STATUS}:status`),
      },
      {
        id: 'currentState.ip.',
        cell: (agentResource: Resource<Agent>) => (
          <AgentIpsCell ip={agentResource.currentState.ip} />
        ),
        label: t(`${NAMESPACES.SYSTEM}:address_ip`),
      },
      {
        id: 'currentState.policy',
        cell: (agentResource: Resource<Agent>) => (
          <AgentPolicyCell policy={agentResource.currentState.policy} />
        ),
        label: t(`${BACKUP_AGENT_NAMESPACES.COMMON}:policy`),
      },
      {
        id: 'createdAt',
        cell: (agentResource: Resource<Agent>) => (
          <AgentCreatedAtDateCell date={agentResource.createdAt} />
        ),
        label: t(`${NAMESPACES.DASHBOARD}:creation_date`),
      },
      {
        id: 'action',
        cell: (agentResource: Resource<Agent>) => (
          <AgentActionsCell tenantId={tenantId!} agentId={agentResource.id} />
        ),
        label: '',
      },
    ],
    [t],
  );
}
