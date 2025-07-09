import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Modal, useNotifications } from '@ovh-ux/manager-react-components';
import { ApiError } from '@ovh-ux/manager-core-api';
import { TRANSLATION_NAMESPACES, startCaseFormat } from '@/utils';
import {
  deleteIpGameFirewallRule,
  getGameFirewallRuleQueryKey,
} from '@/data/api';
import { GameFirewallContext } from '../gamefirewall.context';

export const DeleteRuleModal: React.FC = () => {
  const {
    ip,
    ipOnGame,
    isConfirmDeleteModalOpen,
    ruleToDelete,
    hideConfirmDeleteModal,
  } = React.useContext(GameFirewallContext);
  const qc = useQueryClient();
  const { addSuccess, addError, clearNotifications } = useNotifications();
  const { t } = useTranslation([
    TRANSLATION_NAMESPACES.gameFirewall,
    NAMESPACES.ACTIONS,
    TRANSLATION_NAMESPACES.error,
  ]);

  const { isPending, mutate: deleteRule } = useMutation({
    mutationFn: () =>
      deleteIpGameFirewallRule({ ip, ipOnGame, ruleId: ruleToDelete?.id }),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: getGameFirewallRuleQueryKey({ ip, ipOnGame }),
      });
      clearNotifications();
      addSuccess(t('delete_rule_success_message'), true);
    },
    onError: (err: ApiError) => {
      clearNotifications();
      addError(
        t('managerApiError', {
          ns: TRANSLATION_NAMESPACES.error,
          error: err?.response?.data?.message,
          ovhQueryId: err?.response?.headers?.['x-ovh-queryid'],
        }),
        true,
      );
    },
    onSettled: hideConfirmDeleteModal,
  });

  return (
    <Modal
      isOpen={isConfirmDeleteModalOpen}
      onDismiss={hideConfirmDeleteModal}
      heading={t('confirmDeleteRuleHeading')}
      primaryLabel={t('confirm', { ns: NAMESPACES.ACTIONS })}
      secondaryLabel={t('cancel', { ns: NAMESPACES.ACTIONS })}
      isSecondaryButtonDisabled={isPending}
      isPrimaryButtonLoading={isPending}
      onPrimaryButtonClick={deleteRule}
      onSecondaryButtonClick={hideConfirmDeleteModal}
    >
      {t('confirmDeleteRuleDescription', {
        protocol: startCaseFormat(ruleToDelete?.protocol),
        port: ruleToDelete?.ports?.from,
      })}
    </Modal>
  );
};
