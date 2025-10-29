import { VCDEdgeGateway } from '@ovh-ux/manager-module-vcd-api';
import { DatagridColumn } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import {
  EdgeGatewayNameCell,
  EdgeGatewayConnectivityCell,
  EdgeGatewayIPBlockCell,
  EdgeGatewayActionCell,
} from '../components/EdgeGatewayCells.component';

export const useEdgeGatewayListingColumns = () => {
  const { t } = useTranslation('datacentres/edge-gateway');
  const { t: tCommonDashboard } = useTranslation(NAMESPACES.DASHBOARD);

  const columns: Array<DatagridColumn<VCDEdgeGateway>> = [
    {
      id: 'name',
      cell: EdgeGatewayNameCell,
      label: tCommonDashboard('name'),
      isSortable: false,
    },
    {
      id: 'connectivity_type',
      cell: EdgeGatewayConnectivityCell,
      label: t('edge_connectivity_type'),
      isSortable: false,
    },
    {
      id: 'ip_block',
      cell: EdgeGatewayIPBlockCell,
      label: t('edge_ip_block'),
      isSortable: false,
    },
    {
      id: 'actions',
      cell: EdgeGatewayActionCell,
      label: '',
      isSortable: false,
    },
  ];

  return columns;
};
