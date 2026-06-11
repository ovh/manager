import { useNavigate } from 'react-router-dom';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Trans, useTranslation } from 'react-i18next';

import { ODS_MODAL_COLOR } from '@ovhcloud/ods-components';
import { OdsMessage } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Modal, useNotifications } from '@ovh-ux/manager-react-components';

import { BACKUP_AGENT_NAMESPACES } from '@/BackupAgent.translations';
import { useTerminateVspcService } from '@/data/hooks/useTerminateVspcService';
import { servicesQueries } from '@/data/queries/services.queries';
import { tenantsQueries } from '@/data/queries/tenants.queries';

export default function TerminateServicePage() {
  const { t } = useTranslation([BACKUP_AGENT_NAMESPACES.SERVICE_DASHBOARD, NAMESPACES.ACTIONS]);
  const navigate = useNavigate();
  const closeModal = () => navigate('..');
  const { addSuccess, addError } = useNotifications();
  const queryClient = useQueryClient();

  const { data: vspcDetail } = useQuery(tenantsQueries.withClient(queryClient).vspcDetail());
  const vspcResourceId = vspcDetail?.id;
  const vspcName = vspcDetail?.currentState.name;

  const { data: serviceIdData, isPending: isServiceIdLoading } = useQuery({
    ...servicesQueries.agoraServiceId(vspcResourceId!),
    enabled: !!vspcResourceId,
    select: (response) => response.data,
  });
  const serviceId = serviceIdData?.[0] ?? null;
  const hasNoAccess = !isServiceIdLoading && vspcResourceId !== undefined && serviceId === null;

  const { mutate: terminate, isPending } = useTerminateVspcService({
    onSuccess: () => addSuccess(t('terminate_service_banner_success', { vspcName })),
    onError: () => addError(t('terminate_service_banner_error')),
    onSettled: () => closeModal(),
  });

  return (
    <Modal
      isOpen
      heading={t('terminate_service_modal_title')}
      primaryLabel={hasNoAccess ? undefined : t(`${NAMESPACES.ACTIONS}:confirm`)}
      onPrimaryButtonClick={hasNoAccess ? undefined : () => terminate(serviceId!)}
      isPrimaryButtonLoading={isPending}
      isPrimaryButtonDisabled={isPending || isServiceIdLoading}
      secondaryLabel={t(`${NAMESPACES.ACTIONS}:cancel`)}
      onSecondaryButtonClick={closeModal}
      onDismiss={closeModal}
      type={ODS_MODAL_COLOR.critical}
    >
      <div className="flex flex-col gap-5">
        {hasNoAccess && (
          <OdsMessage color="warning" isDismissible={false}>
            {t('terminate_service_no_access')}
          </OdsMessage>
        )}
        <p>
          <Trans
            i18nKey="terminate_service_modal_content"
            ns={BACKUP_AGENT_NAMESPACES.SERVICE_DASHBOARD}
            values={{ vspcName }}
            components={{ strong: <strong /> }}
          />
        </p>
      </div>
    </Modal>
  );
}
