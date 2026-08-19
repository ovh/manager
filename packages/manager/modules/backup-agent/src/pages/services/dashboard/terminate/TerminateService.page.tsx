import { useNavigate } from 'react-router-dom';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Trans, useTranslation } from 'react-i18next';

import { ODS_MODAL_COLOR } from '@ovhcloud/ods-components';
import { OdsMessage } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Region } from '@ovh-ux/manager-config';
import { Links, Modal, useNotifications } from '@ovh-ux/manager-react-components';
import { useEnvironment } from '@ovh-ux/manager-react-shell-client';

import { BACKUP_AGENT_NAMESPACES } from '@/BackupAgent.translations';
import { useTerminateVspcService } from '@/data/hooks/useTerminateVspcService';
import { servicesQueries } from '@/data/queries/services.queries';
import { tenantsQueries } from '@/data/queries/tenants.queries';

const US_TERMINATE_SERVICE_GUIDE_URL =
  'https://support.us.ovhcloud.com/hc/en-us/articles/52076648933779-Backup-Agent-Service-updates';

export default function TerminateServicePage() {
  const { t } = useTranslation([BACKUP_AGENT_NAMESPACES.SERVICE_DASHBOARD, NAMESPACES.ACTIONS]);
  const navigate = useNavigate();
  const closeModal = () => navigate('..');
  const { addSuccess, addError } = useNotifications();
  const queryClient = useQueryClient();
  const isUsRegion = useEnvironment().getRegion?.() === Region.US;

  const { data: tenantDetails } = useQuery(tenantsQueries.withClient(queryClient).details());
  const { data: vspcDetail } = useQuery(tenantsQueries.withClient(queryClient).vspcDetail());
  const tenantResourceId = tenantDetails?.id;
  const vspcName = vspcDetail?.currentState.name;

  const { data: serviceIdData, isPending: isServiceIdLoading } = useQuery({
    ...servicesQueries.agoraServiceId(tenantResourceId!),
    enabled: !!tenantResourceId,
    select: (response) => response.data,
  });
  const serviceId = serviceIdData?.[0] ?? null;
  const hasNoAccess = !isServiceIdLoading && tenantResourceId !== undefined && serviceId === null;

  const { mutate: terminate, isPending } = useTerminateVspcService({
    onSuccess: () => addSuccess(t('terminate_service_banner_success', { vspcName })),
    onError: () => addError(t('terminate_service_banner_error')),
    onSettled: () => closeModal(),
  });

  return (
    <Modal
      isOpen
      heading={t(isUsRegion ? 'terminate_service_modal_us_title' : 'terminate_service_modal_title')}
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
        {isUsRegion ? (
          <>
            <OdsMessage color="warning" isDismissible={false}>
              {t('terminate_service_modal_us_warning')}
            </OdsMessage>
            <p>{t('terminate_service_modal_us_unavailable')}</p>
            <p>{t('terminate_service_modal_us_contact_support')}</p>
            <p>{t('terminate_service_modal_us_single_agent')}</p>
            <p>
              <Trans
                i18nKey="terminate_service_modal_us_guide"
                ns={BACKUP_AGENT_NAMESPACES.SERVICE_DASHBOARD}
                components={{
                  Link: (
                    <Links
                      rel="noopener noreferrer"
                      target="_blank"
                      href={US_TERMINATE_SERVICE_GUIDE_URL}
                    />
                  ),
                }}
              />
            </p>
          </>
        ) : (
          <p>
            <Trans
              i18nKey="terminate_service_modal_content"
              ns={BACKUP_AGENT_NAMESPACES.SERVICE_DASHBOARD}
              values={{ vspcName }}
              components={{ strong: <strong /> }}
            />
          </p>
        )}
      </div>
    </Modal>
  );
}
