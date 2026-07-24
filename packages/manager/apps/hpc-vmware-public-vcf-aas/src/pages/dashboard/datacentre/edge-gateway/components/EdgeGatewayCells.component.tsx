import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  VCDEdgeGatewayWithIpBlock,
  VCFAdvancedResourceStatus,
} from '@ovh-ux/manager-module-vcd-api';
import {
  ActionMenu,
  ActionMenuItem,
  DataGridTextCell,
} from '@ovh-ux/manager-react-components';
import { ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { OdsTooltip } from '@ovhcloud/ods-components/react';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { useHref } from 'react-router-dom';
import { subRoutes } from '@/routes/routes.constant';

const ACTIONS_DISABLED_TOOLTIP: Partial<Record<
  VCFAdvancedResourceStatus,
  string
>> = {
  CREATING: 'datacentres/edge-gateway:edge_actions_creating_tooltip',
  DELETING: 'datacentres/edge-gateway:edge_actions_deleting_tooltip',
};

export const EdgeGatewayNameCell = (edge: VCDEdgeGatewayWithIpBlock) => (
  <DataGridTextCell>{edge.currentState.name}</DataGridTextCell>
);

export const EdgeGatewayIPBlockCell = (edge: VCDEdgeGatewayWithIpBlock) => (
  <DataGridTextCell>{edge.ipBlock?.internalScope ?? '-'}</DataGridTextCell>
);

export const EdgeGatewayActionCell = (edge: VCDEdgeGatewayWithIpBlock) => {
  const { t } = useTranslation([
    'datacentres/edge-gateway',
    NAMESPACES.ACTIONS,
  ]);
  const id = useId();
  const tooltipId = useId();
  const disabledTooltipKey = ACTIONS_DISABLED_TOOLTIP[edge.resourceStatus];
  const deleteHref = useHref(`${edge.id}/${subRoutes.deleteEdgeGateway}`);
  const editNameHref = useHref(`${edge.id}/${subRoutes.editEdgeGatewayName}`);
  const editIpBlockHref = useHref(
    `${edge.id}/${subRoutes.editEdgeGatewayIpBlock}`,
  );

  const actionMenuItems: ActionMenuItem[] = [
    {
      id: 1,
      label: t('datacentres/edge-gateway:edge_edit_name'),
      isDisabled: false,
      onClick: () => {},
      href: editNameHref,
    },
    {
      id: 2,
      label: t('datacentres/edge-gateway:edge_edit_ip_block'),
      isDisabled: false,
      onClick: () => {},
      href: editIpBlockHref,
    },
    {
      id: 3,
      label: t(`${NAMESPACES.ACTIONS}:delete`),
      isDisabled: false,
      onClick: () => {},
      href: deleteHref,
    },
  ];

  const actionMenu = (
    <ActionMenu
      id={`edgeActionMenu-${id}`}
      items={actionMenuItems}
      isCompact
      variant={ODS_BUTTON_VARIANT.ghost}
      isDisabled={!!disabledTooltipKey}
    />
  );

  return disabledTooltipKey ? (
    <>
      <div id={tooltipId} className="w-fit">
        {actionMenu}
      </div>
      <OdsTooltip triggerId={tooltipId} withArrow>
        {t(disabledTooltipKey)}
      </OdsTooltip>
    </>
  ) : (
    actionMenu
  );
};
