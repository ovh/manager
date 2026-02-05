import React from 'react';

import { useTranslation } from 'react-i18next';

import { BACKUP_AGENT_NAMESPACES } from '@/BackupAgent.translations';
import { ResourceStatusBadge } from '@/components/ResourceStatusBadge/ResourceStatusBadge.component';
import { agentStatusColor } from '@/components/ResourceStatusBadge/_utils/resourceStatusColor.utils';
import { AgentStatus } from '@/types/Resource.type';

export const AgentStatusLegend = () => {
  const { t } = useTranslation([BACKUP_AGENT_NAMESPACES.COMMON]);

  return (
    <dl className="grid grid-cols-2 grid-cols-[auto_1fr] gap-6 max-w-xl items-center">
      {Object.keys(agentStatusColor).map((status) => (
        <React.Fragment key={status}>
          <dt>
            <ResourceStatusBadge resourceStatus={status as AgentStatus} />
          </dt>
          <dd className="ml-0">
            {t(`${BACKUP_AGENT_NAMESPACES.COMMON}:agent_status_${status.toLowerCase()}_legend`)}
          </dd>
        </React.Fragment>
      ))}
    </dl>
  );
};
