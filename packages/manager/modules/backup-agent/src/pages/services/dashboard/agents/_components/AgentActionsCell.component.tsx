import { useId } from 'react';

import { useTranslation } from 'react-i18next';

import { OdsButton, OdsPopover } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { DataGridTextCell } from '@ovh-ux/manager-react-components';

import { BACKUP_AGENT_NAMESPACES } from '@/lib';
import { Agent } from '@/types/Agent.type';
import { Resource } from '@/types/Resource.type';

export const AgentActionsCell = (resourceAgent: Resource<Agent>) => {
  const id = useId();
  const { t } = useTranslation([NAMESPACES.ACTIONS, BACKUP_AGENT_NAMESPACES.COMMON]);

  return (
    <DataGridTextCell>
      <OdsButton
        id={id}
        role="button"
        label=""
        icon="ellipsis-vertical"
        variant="ghost"
        aria-label={t(`${BACKUP_AGENT_NAMESPACES.COMMON}:actions`)}
      />
      <OdsPopover triggerId={id} with-arrow="">
        <OdsButton
          label={t(`${NAMESPACES.ACTIONS}:configure`)}
          onClick={() => console.log(`Configure ${resourceAgent.id}`)}
        />
        <OdsButton
          color="critical"
          label={t(`${NAMESPACES.ACTIONS}:delete`)}
          onClick={() => console.log(`Delete ${resourceAgent.id}`)}
        />
      </OdsPopover>
    </DataGridTextCell>
  );
};
