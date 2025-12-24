import React from 'react';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { ODS_MODAL_COLOR } from '@ovhcloud/ods-components';
import { OdsText } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ApiError } from '@ovh-ux/manager-core-api';
import { Modal, useNotifications } from '@ovh-ux/manager-react-components';
import { PageType, useOvhTracking } from '@ovh-ux/manager-react-shell-client';

import { getIpEdgeFirewallQueryKey, putIpEdgeFirewall } from '@/data/api';
import { TRANSLATION_NAMESPACES } from '@/utils';

import { EdgeNetworkFirewallContext } from '../edgeNetworkFirewall.context';

export const EnableEdgeNetworkFirewallModal: React.FC = () => {
  const {
    isEnableFirewallModalVisible,
    hideEnableFirewallModal,
    ip,
    ipOnFirewall,
    firewallModeEnabled,
  } = React.useContext(EdgeNetworkFirewallContext);
  const queryClient = useQueryClient();
  const { addError } = useNotifications();
  const { trackPage } = useOvhTracking();
  const { t } = useTranslation([
    TRANSLATION_NAMESPACES.edgeNetworkFirewall,
    NAMESPACES.ACTIONS,
    TRANSLATION_NAMESPACES.error,
  ]);

  const { isPending: isUpdatePending, mutate: updateGameFirewall } =
    useMutation({
      mutationFn: () =>
        putIpEdgeFirewall({ ip, ipOnFirewall, enabled: !firewallModeEnabled }),
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: getIpEdgeFirewallQueryKey({ ip, ipOnFirewall }),
        });
      },
      onError: (err: ApiError) => {
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
          pageName: 'enable_edge-network-firewall_error',
        });
      },
      onSettled: hideEnableFirewallModal,
    });

  return (
    <Modal
      isOpen={isEnableFirewallModalVisible}
      onDismiss={hideEnableFirewallModal}
      heading={
        firewallModeEnabled
          ? t('disable_firewall_modal_title')
          : t('enable_firewall_modal_title')
      }
      type={ODS_MODAL_COLOR.neutral}
      primaryLabel={t('validate', { ns: NAMESPACES.ACTIONS })}
      onPrimaryButtonClick={updateGameFirewall}
      isPrimaryButtonLoading={isUpdatePending}
      secondaryLabel={t('cancel', { ns: NAMESPACES.ACTIONS })}
      isSecondaryButtonDisabled={isUpdatePending}
      onSecondaryButtonClick={hideEnableFirewallModal}
    >
      <OdsText>
        {firewallModeEnabled
          ? t('disabled_firewall_modal_description', { ip: ipOnFirewall })
          : t('enable_firewall_modal_description')}
      </OdsText>
    </Modal>
  );
};
