import { useId } from 'react';

import { useHref } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ODS_BUTTON_COLOR, ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ActionMenu, ActionMenuItem, DataGridTextCell } from '@ovh-ux/manager-react-components';
import { ButtonType, PageLocation, useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { BACKUP_AGENT_NAMESPACES } from '@/BackupAgent.translations';
import { BACKUP_AGENT_IAM_RULES } from '@/module.constants';
import { subRoutes } from '@/routes/routes.constants';

export type AgentActionsCellProps = {
  agentId: string;
};
export const AgentActionsCell = ({ agentId }: AgentActionsCellProps) => {
  const id = useId();
  const { t } = useTranslation([NAMESPACES.ACTIONS, BACKUP_AGENT_NAMESPACES.COMMON]);
  const { trackClick } = useOvhTracking();
  const configurationHref = useHref(`${subRoutes.configure}/${agentId}`);

  const deleteHref = useHref(`${subRoutes.delete}/${agentId}`);

  const actions: ActionMenuItem[] = [
    {
      id: 0,
      label: t(`${NAMESPACES.ACTIONS}:configure`),
      href: configurationHref,
      iamActions: [BACKUP_AGENT_IAM_RULES['vspc/edit']],
      onClick: () =>
        trackClick({
          location: PageLocation.datagrid,
          buttonType: ButtonType.button,
          actionType: 'navigation',
          actions: ['configure-agent'],
        }),
    },
    {
      id: 1,
      label: t(`${NAMESPACES.ACTIONS}:delete`),
      href: deleteHref,
      color: ODS_BUTTON_COLOR.critical,
      iamActions: [BACKUP_AGENT_IAM_RULES['vspc/edit']],
      onClick: () =>
        trackClick({
          location: PageLocation.datagrid,
          buttonType: ButtonType.button,
          actionType: 'action',
          actions: ['delete-agent'],
        }),
    },
  ];

  return (
    <DataGridTextCell>
      <ActionMenu id={id} items={actions} isCompact variant={ODS_BUTTON_VARIANT.ghost} />
    </DataGridTextCell>
  );
};
