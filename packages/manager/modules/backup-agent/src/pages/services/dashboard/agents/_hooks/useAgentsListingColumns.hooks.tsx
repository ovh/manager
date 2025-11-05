import { useMemo } from 'react';

import { useTranslation } from 'react-i18next';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {AgentIpsCell, AgentNameCell, AgentPolicyCell, AgentActionsCell} from "../_components";
import {Resource} from "@/types/Resource.type";
import {ResourceStatusCell} from "@/components/CommonCells/ResourceStatusCell/ResourceStatusCell.components";
import {Agent} from "@/types/Agent.type";
import {AgentCreatedAtDateCell} from "@/pages/services/dashboard/agents/_components/AgentCreatedAtDateCell.component";
import {BACKUP_AGENT_NAMESPACES} from "@/BackupAgent.translations";

export function useAgentsListingColumnsHooks() {
  const { t } = useTranslation([BACKUP_AGENT_NAMESPACES.COMMON, NAMESPACES.DASHBOARD, NAMESPACES.SYSTEM, NAMESPACES.STATUS]);

  return useMemo(() => [
    {
      id: 'currentState.name',
      cell: (agentResource: Resource<Agent>) => <AgentNameCell id={agentResource.id} name={agentResource.currentState.name} />,
      label: t(`${NAMESPACES.DASHBOARD}:name`),
    },
    {
      id: 'resourceStatus',
      cell: (agentResource: Resource<Agent>) => <ResourceStatusCell resourceStatus={agentResource.resourceStatus}/>,
      label: t(`${NAMESPACES.STATUS}:status`),
    },
    {
      id: 'currentState.ip.',
      cell: (agentResource: Resource<Agent>) => <AgentIpsCell ip={agentResource.currentState.ip} />,
      label: t(`${NAMESPACES.SYSTEM}:address_ip`),
    },
    {
      id: 'currentState.policy',
      cell: (agentResource: Resource<Agent>) => <AgentPolicyCell policy={agentResource.currentState.policy} />,
      label: t(`${BACKUP_AGENT_NAMESPACES.COMMON}:policy`),
    },
    {
      id: 'createdAt',
      cell: (agentResource: Resource<Agent>) => <AgentCreatedAtDateCell date={agentResource.createdAt} />,
      label: t(`${NAMESPACES.DASHBOARD}:creation_date`),
    },
    {
      id: 'action',
      cell: AgentActionsCell,
      label: '',
    },
    ], [t]);
}
