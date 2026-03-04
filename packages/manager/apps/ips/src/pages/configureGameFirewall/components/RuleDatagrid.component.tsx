import React from 'react';

import { useTranslation } from 'react-i18next';

import { TABLE_SIZE } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Datagrid, DatagridColumn } from '@ovh-ux/muk';

import { IpGameFirewallRule } from '@/data/api';
import { TRANSLATION_NAMESPACES } from '@/utils';

import { GameFirewallContext } from '../gamefirewall.context';
import { ActionColumn } from './ActionColumn.component';
import { GameProtocolColumn } from './GameProtocolColumn.component';
import { EndPortColumn, StartPortColumn } from './PortColumn.component';
import { StatusColumn } from './StatusColumn.component';
import { TopBar } from './TopBar.component';

export const RuleDatagrid: React.FC = () => {
  const {
    isNewRuleRowDisplayed,
    loading,
    isRulesLoading,
    rules,
  } = React.useContext(GameFirewallContext);
  const { t } = useTranslation([
    TRANSLATION_NAMESPACES.gameFirewall,
    NAMESPACES.STATUS,
    TRANSLATION_NAMESPACES.error,
  ]);

  const columns: DatagridColumn<IpGameFirewallRule & { isNew?: boolean }>[] = [
    {
      id: 'game-protocol',
      accessorKey: 'protocol',
      header: t('gameProtocolColumnLabel'),
      cell: ({ row }) => <GameProtocolColumn {...row.original} />,
    },
    {
      id: 'start-port',
      accessorKey: 'ports',
      header: t('startPortColumnLabel'),
      cell: ({ row }) => <StartPortColumn {...row.original} />,
    },
    {
      id: 'end-port',
      accessorKey: 'ports',
      header: t('endPortColumnLabel'),
      cell: ({ row }) => <EndPortColumn {...row.original} />,
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
      size: 50,
      cell: ({ row }) => <ActionColumn {...row.original} />,
    },
  ];

  const datagrid = React.useMemo(() => {
    return (
      <Datagrid
        size={TABLE_SIZE.sm}
        topbar={<TopBar />}
        containerHeight={(rules?.length + 2) * 50}
        columns={columns}
        data={
          (isNewRuleRowDisplayed
            ? [
                { isNew: true } as IpGameFirewallRule & { isNew: boolean },
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
