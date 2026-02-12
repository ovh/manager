import React from 'react';

import { useTranslation } from 'react-i18next';

import { TABLE_SIZE } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Datagrid, DatagridColumn } from '@ovh-ux/muk';

import { IpEdgeFirewallRule } from '@/data/api';
import { TRANSLATION_NAMESPACES } from '@/utils';

import { EdgeNetworkFirewallContext } from '../edgeNetworkFirewall.context';
import { ActionColumn } from './ActionColumn.component';
import { ModeColumn } from './ModeColumn.component';
import {
  DestinationPortColumn,
  SourcePortColumn,
} from './PortColumn.component';
import { ProtocolColumn } from './ProtocolColumn.component';
import { SequenceColumn } from './SequenceColumn.component';
import { SourceColumn } from './SourceColumn.component';
import { StatusColumn } from './StatusColumn.component';
import { TcpOptionColumn } from './TcpOptionColumn.component';
import { TopBar } from './TopBar.component';

export const RuleDatagrid: React.FC = () => {
  const {
    isNewRuleRowDisplayed,
    loading,
    isRulesLoading,
    rules,
  } = React.useContext(EdgeNetworkFirewallContext);
  const { t } = useTranslation([
    TRANSLATION_NAMESPACES.edgeNetworkFirewall,
    NAMESPACES.STATUS,
    TRANSLATION_NAMESPACES.error,
  ]);

  const columns: DatagridColumn<IpEdgeFirewallRule & { isNew?: boolean }>[] = [
    {
      id: 'sequence',
      accessorKey: 'sequence',
      header: t('sequenceColumnLabel'),
      size: 70,
      cell: ({ row }) => <SequenceColumn {...row.original} />,
    },
    {
      id: 'mode',
      accessorKey: 'mode',
      header: t('modeColumnLabel'),
      cell: ({ row }) => <ModeColumn {...row.original} />,
    },
    {
      id: 'protocol',
      accessorKey: 'protocol',
      header: t('protocolColumnLabel'),
      size: 100,
      cell: ({ row }) => <ProtocolColumn {...row.original} />,
    },
    {
      id: 'source',
      accessorKey: 'source',
      header: t('sourceColumnLabel'),
      cell: ({ row }) => <SourceColumn {...row.original} />,
    },
    {
      id: 'source-port',
      accessorKey: 'sourcePort',
      header: t('sourcePortColumnLabel'),
      cell: ({ row }) => <SourcePortColumn {...row.original} />,
    },
    {
      id: 'destination-port',
      accessorKey: 'destinationPort',
      header: t('destinationPortColumnLabel'),
      cell: ({ row }) => <DestinationPortColumn {...row.original} />,
    },
    {
      id: 'tcp-options',
      accessorKey: 'tcpOptions',
      header: t('tcpOptionsColumnLabel'),
      cell: ({ row }) => <TcpOptionColumn {...row.original} />,
    },
    {
      id: 'status',
      accessorKey: 'state',
      header: t('status', { ns: NAMESPACES.STATUS }),
      cell: ({ row }) => <StatusColumn {...row.original} />,
    },
    {
      id: 'action',
      accessorKey: 'id',
      header: '',
      size: 70,
      cell: ({ row }) => <ActionColumn {...row.original} />,
    },
  ];

  const datagrid = React.useMemo(() => {
    return (
      <Datagrid
        size={TABLE_SIZE.sm}
        columns={columns}
        topbar={<TopBar />}
        containerHeight={(rules?.length + 2) * 50}
        data={
          (isNewRuleRowDisplayed
            ? [
                { isNew: true } as IpEdgeFirewallRule & { isNew: boolean },
                ...rules,
              ]
            : rules) || []
        }
        totalCount={rules?.length + (isNewRuleRowDisplayed ? 1 : 0)}
        isLoading={loading || isRulesLoading}
      />
    );
  }, [isNewRuleRowDisplayed, loading, isRulesLoading, JSON.stringify(rules)]);
  return datagrid;
};
