import { useNavigate, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ODS_MODAL_COLOR } from '@ovhcloud/ods-components';
import { OdsText } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Modal, useNotifications } from '@ovh-ux/manager-react-components';

import { BACKUP_AGENT_NAMESPACES } from '@/BackupAgent.translations';
import { useBackupVSPCTenantAgentDetails } from '@/data/hooks/agents/getAgentDetails';
import { useDeleteTenantAgent } from '@/data/hooks/agents/useDeleteAgent';

export default function DeleteAgentPage() {
  const { t } = useTranslation([BACKUP_AGENT_NAMESPACES.AGENT, NAMESPACES.ACTIONS]);
  const navigate = useNavigate();
  const closeModal = () => navigate('..');
  const { addSuccess, addError } = useNotifications();

  const { tenantId, agentId } = useParams<{ tenantId: string; agentId: string }>();
  const { data } = useBackupVSPCTenantAgentDetails({ tenantId, agentId });

  const { mutate: deleteAgent, isPending } = useDeleteTenantAgent({
    onSuccess: () =>
      addSuccess(t('delete_agent_banner_success', { agentName: data?.currentState.name })),
    onError: () => addError(t('delete_agent_banner_error')),
    onSettled: () => closeModal(),
  });

  return (
    <Modal
      isOpen
      heading={t('delete_agent_modal_title')}
      primaryLabel={t(`${NAMESPACES.ACTIONS}:confirm`)}
      onPrimaryButtonClick={() => agentId && deleteAgent({ vspcTenantId: tenantId!, agentId })}
      isPrimaryButtonLoading={isPending}
      isPrimaryButtonDisabled={isPending}
      secondaryLabel={t(`${NAMESPACES.ACTIONS}:cancel`)}
      onSecondaryButtonClick={closeModal}
      onDismiss={closeModal}
      type={ODS_MODAL_COLOR.critical}
    >
      <OdsText>{t('delete_agent_modal_content', { agentName: data?.currentState.name })}</OdsText>
    </Modal>
  );
}
