import React from 'react';
import { OdsButton } from '@ovhcloud/ods-components/react';
import { ODS_BUTTON_VARIANT, ODS_ICON_NAME } from '@ovhcloud/ods-components';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNotifications } from '@ovh-ux/manager-react-components';
import { useTranslation } from 'react-i18next';
import { ApiError } from '@ovh-ux/manager-core-api';
import { TRANSLATION_NAMESPACES } from '@/utils';
import {
  addIpGameFirewallRule,
  getGameFirewallRuleQueryKey,
  IpGameFirewallRule,
} from '@/data/api';
import { GameFirewallContext } from '../gamefirewall.context';
import { hasConflictingPorts, hasPortRangeError } from '../gamefirewall.utils';

export const ActionColumn = (
  rule: IpGameFirewallRule & { isNew?: boolean },
) => {
  const qc = useQueryClient();
  const { clearNotifications, addSuccess, addError } = useNotifications();
  const {
    rules,
    newGameProtocol,
    newStartPort,
    newEndPort,
    hideNewRuleRow,
    showConfirmDeleteModal,
    ip,
    ipOnGame,
  } = React.useContext(GameFirewallContext);
  const { t } = useTranslation([
    TRANSLATION_NAMESPACES.gameFirewall,
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

  return rule?.isNew ? (
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
  );
};
