import React from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ApiError } from '@ovh-ux/manager-core-api';
import { Modal, useNotifications } from '@ovh-ux/muk';
import {
  ButtonType,
  PageLocation,
  PageType,
  useOvhTracking,
} from '@ovh-ux/manager-react-shell-client';

import {
  deleteIpEdgeNetworkFirewallRule,
  getIpEdgeNetworkFirewallRuleDetailsQueryKey,
  getIpEdgeNetworkFirewallRuleListQueryKey,
} from '@/data/api';
import { TRANSLATION_NAMESPACES } from '@/utils';

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
  const { trackClick, trackPage } = useOvhTracking();
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
      qc.removeQueries({
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
      trackPage({
        pageType: PageType.bannerSuccess,
        pageName: 'configure_edge-firewall_delete-rule_success',
      });
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
      trackPage({
        pageType: PageType.bannerError,
        pageName: 'configure_edge-firewall_delete-rule_error',
      });
    },
    onSettled: hideConfirmDeleteModal,
  });

  return (
    <Modal
      open={isConfirmDeleteModalOpen}
      onOpenChange={hideConfirmDeleteModal}
      heading={t('confirmDeleteRuleHeading')}
      primaryButton={{
        label: t('confirm', { ns: NAMESPACES.ACTIONS }),
        loading: isPending,
        onClick: () => {
          trackClick({
            location: PageLocation.popup,
            buttonType: ButtonType.button,
            actionType: 'action',
            actions: ['configure_edge-firewall', 'delete_rule', 'confirm'],
          });
          deleteRule();
        },
      }}
      secondaryButton={{
        label: t('cancel', { ns: NAMESPACES.ACTIONS }),
        onClick: hideConfirmDeleteModal,
        disabled: isPending,
      }}
    >
      {t('confirmDeleteRuleDescription', {
        sequence: ruleToDelete?.sequence,
      })}
    </Modal>
  );
};
