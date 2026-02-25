import { useNavigate, useParams } from 'react-router-dom';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Trans, useTranslation } from 'react-i18next';

import { ODS_MODAL_COLOR } from '@ovhcloud/ods-components';
import { OdsMessage, OdsText } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Modal, useNotifications } from '@ovh-ux/manager-react-components';

import { BACKUP_AGENT_NAMESPACES } from '@/BackupAgent.translations';
import { useDeleteTenantAgent } from '@/data/hooks/useDeleteTenantAgent';
import { agentsQueries } from '@/data/queries/agents.queries';

export default function DeleteAgentPage() {
  const { t } = useTranslation([BACKUP_AGENT_NAMESPACES.AGENT, NAMESPACES.ACTIONS]);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const closeModal = () => navigate('..');
  const { addSuccess, addError } = useNotifications();

  const { agentId } = useParams<{ agentId: string }>();
  const { data } = useQuery(agentsQueries.withClient(queryClient).detail(agentId!));

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
      onPrimaryButtonClick={() => agentId && deleteAgent({ agentId })}
      isPrimaryButtonLoading={isPending}
      isPrimaryButtonDisabled={isPending}
      secondaryLabel={t(`${NAMESPACES.ACTIONS}:cancel`)}
      onSecondaryButtonClick={closeModal}
      onDismiss={closeModal}
      type={ODS_MODAL_COLOR.critical}
    >
      <OdsMessage color="warning" isDismissible={false} className="mb-4">
        {t('delete_agent_modal_content_main')}
      </OdsMessage>
      <OdsText className="[&::part(text)]:font-bold">
        <Trans
          ns={BACKUP_AGENT_NAMESPACES.AGENT}
          i18nKey="delete_agent_modal_content_confirm"
          values={{ agentName: data?.currentState.name }}
          components={{
            span: <span className="whitespace-nowrap" />,
          }}
        />
      </OdsText>
    </Modal>
  );
}
