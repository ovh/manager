import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Modal, useNotifications } from '@ovh-ux/manager-react-components';
import { ODS_MODAL_COLOR } from '@ovhcloud/ods-components';
import { Text, TEXT_PRESET } from '@ovhcloud/ods-react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useGetDomainResource,
  useUpdateDomainResource,
} from '@/domain/hooks/data/query';
import { urls } from '@/domain/routes/routes.constant';
import { useGenerateUrl } from '@/common/hooks/generateUrl/useGenerateUrl';

export default function HostDelete() {
  const navigate = useNavigate();
  const { t } = useTranslation(['domain', NAMESPACES.ACTIONS]);
  const { serviceName, hostname } = useParams();
  const { domainResource, isFetchingDomainResource } = useGetDomainResource(
    serviceName,
  );
  const { updateDomain, isUpdateDomainPending } = useUpdateDomainResource(
    serviceName,
  );
  const { addError, addSuccess } = useNotifications();
  const url = useGenerateUrl(urls.domainTabHost, 'path', { serviceName });

  return (
    <Modal
      isOpen={true}
      heading={t('domain_tab_hosts_modal_delete_title', {
        hostname,
      })}
      type={ODS_MODAL_COLOR.critical}
      primaryLabel={t(`${NAMESPACES.ACTIONS}:delete`)}
      onPrimaryButtonClick={() => {
        updateDomain(
          {
            currentTargetSpec: domainResource?.targetSpec,
            updatedSpec: {
              hostsConfiguration: {
                hosts: [
                  ...domainResource.targetSpec.hostsConfiguration.hosts.filter(
                    (item) => item.host !== hostname,
                  ),
                ],
              },
            },
          },
          {
            onSuccess: () => {
              addSuccess(t('domain_tab_hosts_modal_delete_success_message'));
            },
            onError: () => {
              addError(t('domain_tab_hosts_modal_delete_error_message'));
            },
            onSettled: () => {
              navigate(url);
            },
          },
        );
      }}
      isPrimaryButtonLoading={isUpdateDomainPending}
      secondaryLabel={t(`${NAMESPACES.ACTIONS}:cancel`)}
      onSecondaryButtonClick={() => navigate(url)}
      isLoading={isFetchingDomainResource}
    >
      <div className="py-6">
        <Text preset={TEXT_PRESET.paragraph}>
          {t('domain_tab_hosts_modal_delete_information_message')}
        </Text>
      </div>
    </Modal>
  );
}
