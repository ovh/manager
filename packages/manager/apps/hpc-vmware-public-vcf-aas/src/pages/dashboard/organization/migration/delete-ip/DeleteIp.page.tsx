import { Suspense } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ODS_MODAL_COLOR } from '@ovhcloud/ods-components';
import { Modal } from '@ovh-ux/manager-react-components';
import { OdsMessage, OdsText } from '@ovhcloud/ods-components/react';
import { useMessageContext } from '@/context/Message.context';
import TEST_IDS from '@/utils/testIds.constants';
import { useUpdateVcdaWhitelist } from '@/data/hooks/vcda/useUpdateVcdaWhitelist.hook';
import { useMigrationContext } from '../Migration.context';

export default function DeleteIpPage() {
  const { t } = useTranslation('migration');
  const { t: tActions } = useTranslation(NAMESPACES.ACTIONS);
  const navigate = useNavigate();
  const closeModal = () => navigate('..');
  const { addSuccess } = useMessageContext();
  const { orgId, migrationId, whitelist } = useMigrationContext();

  const { search } = useLocation();
  const targetIp = new URLSearchParams(search).get('ip') ?? '';
  const cidr = `${targetIp}/32`;

  const { mutate: updateWhitelist, error, isPending } = useUpdateVcdaWhitelist({
    orgId,
    migrationId,
    onSuccess: () => {
      addSuccess({
        content: t('migration.deleteModal.toast.success'),
        includedSubRoutes: [orgId],
        duration: 5000,
      });
      closeModal();
    },
  });

  const onConfirm = () =>
    updateWhitelist(
      whitelist.map((entry) => entry.ip).filter((ip) => ip !== targetIp),
    );

  return (
    <Suspense>
      <Modal
        isOpen
        heading={t('migration.deleteModal.title')}
        onDismiss={closeModal}
        type={ODS_MODAL_COLOR.critical}
        primaryLabel={t('migration.deleteModal.button.confirm')}
        onPrimaryButtonClick={onConfirm}
        isPrimaryButtonDisabled={isPending}
        isPrimaryButtonLoading={isPending}
        secondaryLabel={tActions('cancel')}
        onSecondaryButtonClick={closeModal}
        primaryButtonTestId={TEST_IDS.migrationDeleteSubmitCta}
      >
        <div className="flex flex-col gap-3">
          {error && (
            <OdsMessage color="critical" isDismissible={false}>
              {t('migration.deleteModal.error.generic')}
            </OdsMessage>
          )}
          <OdsText preset="paragraph">
            {t('migration.deleteModal.body', { cidr })}
          </OdsText>
          <OdsMessage color="warning" isDismissible={false}>
            {cidr}
          </OdsMessage>
        </div>
      </Modal>
    </Suspense>
  );
}
