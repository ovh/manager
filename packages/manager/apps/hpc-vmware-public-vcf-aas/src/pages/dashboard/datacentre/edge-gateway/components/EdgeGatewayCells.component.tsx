import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { VCDEdgeGateway } from '@ovh-ux/manager-module-vcd-api';
import {
  ActionMenu,
  ActionMenuItem,
  DataGridTextCell,
} from '@ovh-ux/manager-react-components';
import { ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { useId } from 'react';
import { useTranslation } from 'react-i18next';

export const EdgeGatewayNameCell = (edge: VCDEdgeGateway) => (
  <DataGridTextCell>{edge.currentState.edgeGatewayName}</DataGridTextCell>
);

export const EdgeGatewayConnectivityCell = () => (
  // TODO: [EDGE] see what content goes here
  <DataGridTextCell>N/A</DataGridTextCell>
);

export const EdgeGatewayIPBlockCell = (edge: VCDEdgeGateway) => (
  <DataGridTextCell>{edge.currentState.ipBlock}</DataGridTextCell>
);

export const EdgeGatewayActionCell = () => {
  const { t } = useTranslation([
    'datacentres/edge-gateway',
    NAMESPACES.ACTIONS,
  ]);
  const id = useId();

  const actionMenuItems: ActionMenuItem[] = [
    {
      id: 1,
      label: t('datacentres/edge-gateway:edge_edit_config'),
      isDisabled: false,
      onClick: () => {},
    },
    {
      id: 2,
      label: t(`${NAMESPACES.ACTIONS}:delete`),
      isDisabled: false,
      onClick: () => {},
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
