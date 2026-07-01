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
  const editHref = useHref(`${edge.id}/${subRoutes.editEdgeGateway}`);

  const actionMenuItems: ActionMenuItem[] = [
    {
      id: 1,
      label: t('datacentres/edge-gateway:edge_edit_config'),
      isDisabled: false,
      onClick: () => {},
      href: editHref,
    },
    {
      id: 2,
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
