import React from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Modal, useNotifications } from '@ovh-ux/manager-react-components';
import { ApiError } from '@ovh-ux/manager-core-api';
import { TRANSLATION_NAMESPACES } from '@/utils';
import {
  deleteIpEdgeNetworkFirewallRule,
  getIpEdgeNetworkFirewallRuleDetailsQueryKey,
  getIpEdgeNetworkFirewallRuleListQueryKey,
} from '@/data/api';
import { EdgeNetworkFirewallContext } from '../edgeNetworkFirewall.context';

export const DeleteRuleModal: React.FC = () => {
  const {
    ip,
    ipOnFirewall,
    isConfirmDeleteModalOpen,
    ruleToDelete,
    hideConfirmDeleteModal,
  } = React.useContext(EdgeNetworkFirewallContext);
  const qc = useQueryClient();
  const { addSuccess, addError, clearNotifications } = useNotifications();
  const { t } = useTranslation([
    TRANSLATION_NAMESPACES.edgeNetworkFirewall,
    NAMESPACES.ACTIONS,
    TRANSLATION_NAMESPACES.error,
  ]);

  const { isPending, mutate: deleteRule } = useMutation({
    mutationFn: () =>
      deleteIpEdgeNetworkFirewallRule({
        ip,
        ipOnFirewall,
        sequence: ruleToDelete?.sequence,
      }),
    onSuccess: async () => {
      await qc.removeQueries({
        queryKey: getIpEdgeNetworkFirewallRuleDetailsQueryKey({
          ip,
          ipOnFirewall,
          sequence: ruleToDelete?.sequence,
        }),
      });
      await qc.invalidateQueries({
        queryKey: getIpEdgeNetworkFirewallRuleListQueryKey({
          ip,
          ipOnFirewall,
        }),
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
        sequence: ruleToDelete?.sequence,
      })}
    </Modal>
  );
};
