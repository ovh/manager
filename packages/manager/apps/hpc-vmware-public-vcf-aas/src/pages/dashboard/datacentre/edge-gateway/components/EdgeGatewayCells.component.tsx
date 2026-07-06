import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { VCDEdgeGatewayWithIpBlock } from '@ovh-ux/manager-module-vcd-api';
import {
  ActionMenu,
  ActionMenuItem,
  DataGridTextCell,
} from '@ovh-ux/manager-react-components';
import { ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';
import { useHref } from 'react-router-dom';
import { subRoutes } from '@/routes/routes.constant';

export const EdgeGatewayNameCell = (edge: VCDEdgeGatewayWithIpBlock) => (
  <DataGridTextCell>{edge.currentState.name}</DataGridTextCell>
);

export const EdgeGatewayIPBlockCell = (edge: VCDEdgeGatewayWithIpBlock) => (
  <DataGridTextCell>{edge.ipBlock?.internalScope ?? ''}</DataGridTextCell>
);

export const EdgeGatewayActionCell = (edge: VCDEdgeGatewayWithIpBlock) => {
  const { t } = useTranslation([
    'datacentres/edge-gateway',
    NAMESPACES.ACTIONS,
  ]);
  const id = useId();
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

  return (
    <ActionMenu
      id={`edgeActionMenu-${id}`}
      items={actionMenuItems}
      isCompact
      variant={ODS_BUTTON_VARIANT.ghost}
      isDisabled={false}
    />
  );
};
