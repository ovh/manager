import React from 'react';
import { useTranslation } from 'react-i18next';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Modal, useNotifications } from '@ovh-ux/manager-react-components';
import { OdsText } from '@ovhcloud/ods-components/react';
import { ODS_MODAL_COLOR } from '@ovhcloud/ods-components';
import { useUpdateIpGameFirewall } from '@/data/hooks';
import { TRANSLATION_NAMESPACES } from '@/utils';
import { GameFirewallContext } from '../gamefirewall.context';

export const StrategyModal: React.FC = () => {
  const {
    isStrategyConfirmationModalVisible,
    hideStrategyConfirmationModal,
    ip,
    ipOnGame,
    firewallModeEnabled,
  } = React.useContext(GameFirewallContext);
  const { addSuccess, addError } = useNotifications();
  const { t } = useTranslation([
    TRANSLATION_NAMESPACES.gameFirewall,
    NAMESPACES.ACTIONS,
    TRANSLATION_NAMESPACES.error,
  ]);

  const {
    isPending: isUpdatePending,
    mutate: updateGameFirewall,
  } = useUpdateIpGameFirewall({
    ip,
    ipOnGame,
    onSuccess: (variables) => {
      addSuccess(
        variables.firewallModeEnabled
          ? t('default_deny_strategy_enabled_success_message')
          : t('default_deny_strategy_disabled_success_message'),
        true,
      );
    },
    onError: (err) => {
      addError(
        t('managerApiError', {
          ns: TRANSLATION_NAMESPACES.error,
          error: err?.response?.data?.message,
          ovhQueryId: err?.response?.headers?.['x-ovh-queryid'],
        }),
        true,
      );
    },
    onSettled: hideStrategyConfirmationModal,
  });

  return (
    <Modal
      isOpen={isStrategyConfirmationModalVisible}
      onDismiss={hideStrategyConfirmationModal}
      heading={
        firewallModeEnabled
          ? t('disable_deny_strategy_modal_title')
          : t('enable_deny_strategy_modal_title')
      }
      type={ODS_MODAL_COLOR.neutral}
      primaryLabel={t('validate', { ns: NAMESPACES.ACTIONS })}
      onPrimaryButtonClick={() =>
        updateGameFirewall({ firewallModeEnabled: !firewallModeEnabled })
      }
      isPrimaryButtonLoading={isUpdatePending}
      secondaryLabel={t('cancel', { ns: NAMESPACES.ACTIONS })}
      isSecondaryButtonDisabled={isUpdatePending}
      onSecondaryButtonClick={hideStrategyConfirmationModal}
    >
      <OdsText>
        {firewallModeEnabled
          ? t('disable_deny_strategy_modal_description')
          : t('enable_deny_strategy_modal_description')}
      </OdsText>
    </Modal>
  );
};
