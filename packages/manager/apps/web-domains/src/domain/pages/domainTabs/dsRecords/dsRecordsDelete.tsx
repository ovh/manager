import { urls } from '@/domain/routes/routes.constant';
import { useGenerateUrl } from '@/common/hooks/generateUrl/useGenerateUrl';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Modal, useNotifications } from '@ovh-ux/manager-react-components';
import { ODS_MODAL_COLOR } from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import {
  useGetDomainResource,
  useUpdateDomainResource,
} from '@/domain/hooks/data/query';
import { Text, TEXT_PRESET } from '@ovhcloud/ods-react';

export default function DsRecordsDelete() {
  const { t } = useTranslation(['domain', NAMESPACES.ACTIONS]);
  const { serviceName, keyTag } = useParams();
  const url = useGenerateUrl(urls.domainTabDsrecords, 'path', { serviceName });
  const navigate = useNavigate();
  const { addError, addSuccess } = useNotifications();
  const { updateDomain, isUpdateDomainPending } = useUpdateDomainResource(
    serviceName,
  );
  const { domainResource, isFetchingDomainResource } = useGetDomainResource(
    serviceName,
  );

  const backToListingPage = () => navigate(url);

  return (
    <Modal
      isOpen
      type={ODS_MODAL_COLOR.critical}
      heading={t('domain_tab_dsrecords_modal_delete_title')}
      primaryLabel={t(`${NAMESPACES.ACTIONS}:delete`)}
      secondaryLabel={t(`${NAMESPACES.ACTIONS}:cancel`)}
      onSecondaryButtonClick={() => backToListingPage()}
      isLoading={isFetchingDomainResource}
      isPrimaryButtonLoading={isUpdateDomainPending}
      onPrimaryButtonClick={() => {
        updateDomain(
          {
            checksum: domainResource?.checksum,
            currentTargetSpec: domainResource?.targetSpec,
            updatedSpec: {
              dnssecConfiguration: {
                dsData: [
                  ...domainResource?.targetSpec.dnssecConfiguration.dsData.filter(
                    (item) => item.keyTag !== Number(keyTag),
                  ),
                ],
              },
            },
          },
          {
            onSuccess: () => {
              addSuccess(
                t('domain_tab_dsrecords_modal_delete_success_message'),
              );
            },
            onError: () => {
              addError(t('domain_tab_dsrecords_modal_delete_error_message'));
            },
            onSettled: () => {
              backToListingPage();
            },
          },
        );
      }}
    >
      <div className="py-6">
        <Text preset={TEXT_PRESET.paragraph}>
          {t('domain_tab_dsrecords_modal_delete_subtitle')}
        </Text>
      </div>
    </Modal>
  );
}
