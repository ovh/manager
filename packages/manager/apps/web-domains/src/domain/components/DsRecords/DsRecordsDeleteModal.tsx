import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Modal, useNotifications } from '@ovh-ux/manager-react-components';
import { ODS_MODAL_COLOR } from '@ovhcloud/ods-components';
import { useTranslation } from 'react-i18next';
import { useUpdateDomainResource } from '@/domain/hooks/data/query';
import { Text, TEXT_PRESET } from '@ovhcloud/ods-react';
import { Dispatch, SetStateAction } from 'react';
import { TDomainResource } from '@/domain/types/domainResource';

interface DsRecordsDeleteModalProps {
  readonly isModalOpen: boolean;
  readonly serviceName: string;
  readonly keyTag: number;
  readonly domainResource: TDomainResource;
  readonly setIsModalOpen: Dispatch<SetStateAction<boolean>>;
}

export default function DsRecordsDeleteModal({
  isModalOpen,
  serviceName,
  keyTag,
  domainResource,
  setIsModalOpen,
}: DsRecordsDeleteModalProps) {
  const { t } = useTranslation(['domain', NAMESPACES.ACTIONS]);
  const { addError, addSuccess } = useNotifications();
  const { updateDomain, isUpdateDomainPending } = useUpdateDomainResource(
    serviceName,
  );

  return (
    <Modal
      isOpen={isModalOpen}
      type={ODS_MODAL_COLOR.critical}
      heading={t('domain_tab_dsrecords_modal_delete_title')}
      primaryLabel={t(`${NAMESPACES.ACTIONS}:delete`)}
      secondaryLabel={t(`${NAMESPACES.ACTIONS}:cancel`)}
      onSecondaryButtonClick={() => setIsModalOpen(false)}
      isPrimaryButtonLoading={isUpdateDomainPending}
      onPrimaryButtonClick={() => {
        updateDomain(
          {
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
              setIsModalOpen(false);
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
