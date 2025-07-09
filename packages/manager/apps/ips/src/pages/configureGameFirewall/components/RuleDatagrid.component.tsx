import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Datagrid,
  DatagridColumn,
  useNotifications,
} from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { OdsButton } from '@ovhcloud/ods-components/react';
import { ODS_BUTTON_VARIANT, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ApiError } from '@ovh-ux/manager-core-api';
import {
  IpGameFirewallRule,
  addIpGameFirewallRule,
  getGameFirewallRuleQueryKey,
} from '@/data/api';
import { StatusColumn } from './StatusColumn.component';
import { GameProtocolColumn } from './GameProtocolColumn.component';
import { PortColumn } from './PortColumn.component';
import { TRANSLATION_NAMESPACES } from '@/utils';
import { GameFirewallContext } from '../gamefirewall.context';
import { hasConflictingPorts, hasPortRangeError } from '../gamefirewall.utils';

export const RuleDatagrid: React.FC = () => {
  const qc = useQueryClient();
  const { addSuccess, addError, clearNotifications } = useNotifications();
  const {
    ip,
    ipOnGame,
    isNewRuleRowDisplayed,
    showNewRuleRow,
    hideNewRuleRow,
    showConfirmDeleteModal,
    isLoading,
    isRulesLoading,
    rules,
    newGameProtocol,
    newEndPort,
    newStartPort,
    setNewEndPort,
    setNewStartPort,
  } = React.useContext(GameFirewallContext);
  const { t } = useTranslation([
    TRANSLATION_NAMESPACES.gameFirewall,
    NAMESPACES.STATUS,
    TRANSLATION_NAMESPACES.error,
  ]);

  const { mutate: addRule } = useMutation({
    mutationFn: () => {
      clearNotifications();
      const startPort = parseInt(newStartPort, 10);
      const endPort = parseInt(newEndPort || newStartPort, 10);

      if (!newStartPort) {
        addError(t('missingPortError'), true);
        return Promise.reject();
      }
      if (startPort > endPort) {
        addError(t('startPortGreaterThanEndPortError'), true);
        return Promise.reject();
      }
      if (hasPortRangeError({ startPort, endPort })) {
        addError(t('portRangeError'), true);
        return Promise.reject();
      }
      if (hasConflictingPorts({ startPort, endPort, rules })) {
        addError(t('conflictingRuleError'), true);
        return Promise.reject();
      }

      return addIpGameFirewallRule({
        ip,
        ipOnGame,
        startPort,
        endPort,
        protocol: newGameProtocol,
      });
    },
    onSuccess: () => {
      clearNotifications();
      qc.invalidateQueries({
        queryKey: getGameFirewallRuleQueryKey({ ip, ipOnGame }),
      });
      addSuccess(t('add_rule_success_message'), true);
      hideNewRuleRow();
    },
    onError: (err?: ApiError) => {
      if (err) {
        clearNotifications();
        addError(
          t('managerApiError', {
            ns: TRANSLATION_NAMESPACES.error,
            error: err?.response?.data?.message,
            ovhQueryId: err?.response?.headers?.['x-ovh-queryid'],
          }),
          true,
        );
      }
    },
  });

  const columns: DatagridColumn<IpGameFirewallRule & { isNew?: boolean }>[] = [
    {
      id: 'game-protocol',
      label: t('gameProtocolColumnLabel'),
      cell: GameProtocolColumn,
    },
    {
      id: 'start-port',
      label: t('startPortColumnLabel'),
      cell: (rule) => (
        <PortColumn
          key={newStartPort}
          rule={rule}
          value={newStartPort}
          onChange={(e) => {
            setNewStartPort(e.detail.value as string);
          }}
        />
      ),
    },
    {
      id: 'end-port',
      label: t('endPortColumnLabel'),
      cell: (rule) => (
        <PortColumn
          key={newEndPort}
          rule={rule}
          value={newEndPort}
          onChange={(e) => {
            setNewEndPort(e.detail.value as string);
          }}
        />
      ),
    },
    {
      id: 'status',
      label: t('status', { ns: NAMESPACES.STATUS }),
      cell: StatusColumn,
    },
    {
      id: 'action',
      label: '',
      cell: (rule) =>
        rule?.isNew ? (
          <>
            <OdsButton
              label=""
              icon={ODS_ICON_NAME.xmark}
              variant={ODS_BUTTON_VARIANT.ghost}
              onClick={hideNewRuleRow}
            />
            <OdsButton
              label=""
              icon={ODS_ICON_NAME.check}
              variant={ODS_BUTTON_VARIANT.ghost}
              isDisabled={!newGameProtocol}
              onClick={() => addRule()}
            />
          </>
        ) : (
          <OdsButton
            label=""
            icon={ODS_ICON_NAME.trash}
            variant={ODS_BUTTON_VARIANT.ghost}
            isDisabled={rule?.state !== 'ok'}
            onClick={() => showConfirmDeleteModal(rule)}
          />
        ),
    },
  ];

  const datagrid = React.useMemo(() => {
    return (
      <Datagrid
        columns={columns}
        items={
          (isNewRuleRowDisplayed ? [{ isNew: true }, ...rules] : rules) || []
        }
        totalItems={rules?.length + (showNewRuleRow ? 1 : 0)}
        isLoading={isLoading || isRulesLoading}
        numberOfLoadingRows={5}
      />
    );
  }, [
    JSON.stringify(rules),
    isLoading,
    isRulesLoading,
    isNewRuleRowDisplayed,
    newGameProtocol,
  ]);

  return <>{datagrid}</>;
};
