import React from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_TABLE_SIZE } from '@ovhcloud/ods-components';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Datagrid, DatagridColumn } from '@ovh-ux/manager-react-components';

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

export const RuleDatagrid: React.FC = () => {
  const { isNewRuleRowDisplayed, isLoading, isRulesLoading, rules } =
    React.useContext(EdgeNetworkFirewallContext);
  const { t } = useTranslation([
    TRANSLATION_NAMESPACES.edgeNetworkFirewall,
    NAMESPACES.STATUS,
    TRANSLATION_NAMESPACES.error,
  ]);

  const columns: DatagridColumn<IpEdgeFirewallRule & { isNew?: boolean }>[] = [
    {
      id: 'sequence',
      label: t('sequenceColumnLabel'),
      cell: SequenceColumn,
    },
    {
      id: 'mode',
      label: t('modeColumnLabel'),
      cell: ModeColumn,
    },
    {
      id: 'protocol',
      label: t('protocolColumnLabel'),
      cell: ProtocolColumn,
    },
    {
      id: 'source',
      label: t('sourceColumnLabel'),
      cell: SourceColumn,
    },
    {
      id: 'source-port',
      label: t('sourcePortColumnLabel'),
      cell: SourcePortColumn,
    },
    {
      id: 'destination-port',
      label: t('destinationPortColumnLabel'),
      cell: DestinationPortColumn,
    },
    {
      id: 'tcp-options',
      label: t('tcpOptionsColumnLabel'),
      cell: TcpOptionColumn,
    },
    {
      id: 'status',
      label: t('status', { ns: NAMESPACES.STATUS }),
      cell: StatusColumn,
    },
    {
      id: 'action',
      label: '',
      cell: ActionColumn,
    },
  ];

  const datagrid = React.useMemo(() => {
    return (
      <Datagrid
        size={ODS_TABLE_SIZE.sm}
        columns={columns}
        items={
          (isNewRuleRowDisplayed
            ? [
                { isNew: true } as IpEdgeFirewallRule & { isNew: boolean },
                ...rules,
              ]
            : rules) || []
        }
        totalItems={rules?.length + (isNewRuleRowDisplayed ? 1 : 0)}
        isLoading={isLoading || isRulesLoading}
        numberOfLoadingRows={5}
      />
    );
  }, [isNewRuleRowDisplayed, isLoading, isRulesLoading, JSON.stringify(rules)]);
  return datagrid;
};
