import React from 'react';

import { useTranslation } from 'react-i18next';

import { ODS_TABLE_SIZE } from '@ovhcloud/ods-components';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Datagrid, DatagridColumn } from '@ovh-ux/manager-react-components';

import { IpGameFirewallRule } from '@/data/api';
import { TRANSLATION_NAMESPACES } from '@/utils';

import { GameFirewallContext } from '../gamefirewall.context';
import { ActionColumn } from './ActionColumn.component';
import { GameProtocolColumn } from './GameProtocolColumn.component';
import { EndPortColumn, StartPortColumn } from './PortColumn.component';
import { StatusColumn } from './StatusColumn.component';

export const RuleDatagrid: React.FC = () => {
  const { isNewRuleRowDisplayed, isLoading, isRulesLoading, rules } =
    React.useContext(GameFirewallContext);
  const { t } = useTranslation([
    TRANSLATION_NAMESPACES.gameFirewall,
    NAMESPACES.STATUS,
    TRANSLATION_NAMESPACES.error,
  ]);

  const columns: DatagridColumn<IpGameFirewallRule & { isNew?: boolean }>[] = [
    {
      id: 'game-protocol',
      label: t('gameProtocolColumnLabel'),
      cell: GameProtocolColumn,
    },
    {
      id: 'start-port',
      label: t('startPortColumnLabel'),
      cell: StartPortColumn,
    },
    {
      id: 'end-port',
      label: t('endPortColumnLabel'),
      cell: EndPortColumn,
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
                { isNew: true } as IpGameFirewallRule & { isNew: boolean },
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
