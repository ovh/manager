import { useMemo } from 'react';

import { useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';

import { BACKUP_AGENT_NAMESPACES } from '@/BackupAgent.translations';
import { ResourceStatusCell } from '@/components/CommonCells/ResourceStatusCell/ResourceStatusCell.component';
import { AgentActionsCell } from '@/pages/services/dashboard/agent/_components/AgentActionsCell.component';
import { AgentDataLocationCell } from '@/pages/services/dashboard/agent/_components/AgentDataLocationCell.component';
import { AgentIpsCell } from '@/pages/services/dashboard/agent/_components/AgentIpsCell.component';
import { AgentNameCell } from '@/pages/services/dashboard/agent/_components/AgentNameCell.component';
import { AgentPolicyCell } from '@/pages/services/dashboard/agent/_components/AgentPolicyCell.component';
import { AgentProductResourceNameCell } from '@/pages/services/dashboard/agent/_components/AgentProductResourceNameCell.component';
import { Agent } from '@/types/Agent.type';
import { AgentResource } from '@/types/Resource.type';

export function useAgentsListingColumnsHooks() {
  const { tenantId } = useParams();
  const { t } = useTranslation([
    BACKUP_AGENT_NAMESPACES.COMMON,
    BACKUP_AGENT_NAMESPACES.SERVICE_LISTING,
    NAMESPACES.DASHBOARD,
    NAMESPACES.SYSTEM,
    NAMESPACES.STATUS,
  ]);

  return useMemo(
    () => [
      {
        id: 'currentState.name',
        cell: (agentResource: AgentResource<Agent>) => (
          <AgentNameCell name={agentResource.currentState.name} />
        ),
        label: t(`${NAMESPACES.DASHBOARD}:name`),
      },
      {
        id: 'resourceStatus',
        cell: (agentResource: AgentResource<Agent>) => (
          <ResourceStatusCell resourceStatus={agentResource.status} />
        ),
        label: t(`${NAMESPACES.STATUS}:status`),
      },
      {
        id: 'currentState.productResourceName',
        cell: (agentResource: AgentResource<Agent>) => (
          <AgentProductResourceNameCell
            productResourceName={agentResource.currentState.productResourceName}
          />
        ),
        label: t(`${BACKUP_AGENT_NAMESPACES.COMMON}:server`),
      },
      {
        id: 'currentState.ip.',
        cell: (agentResource: AgentResource<Agent>) => (
          <AgentIpsCell ips={agentResource.currentState.ips} />
        ),
        label: t(`${NAMESPACES.SYSTEM}:address_ip`),
      },
      {
        id: 'currentState.policy',
        cell: (agentResource: AgentResource<Agent>) => (
          <AgentPolicyCell policy={agentResource.currentState.policy} />
        ),
        label: t(`${BACKUP_AGENT_NAMESPACES.COMMON}:policy`),
      },
      {
        id: 'currentState.vaultId',
        cell: (agentResource: AgentResource<Agent>) => (
          <AgentDataLocationCell vaultId={agentResource.currentState.vaultId} />
        ),
        label: t(`${BACKUP_AGENT_NAMESPACES.SERVICE_LISTING}:data_location`),
      },
      {
        id: 'action',
        cell: (agentResource: AgentResource<Agent>) => (
          <AgentActionsCell tenantId={tenantId!} agentId={agentResource.id} />
        ),
        label: '',
      },
    ],
    [t],
  );
}
