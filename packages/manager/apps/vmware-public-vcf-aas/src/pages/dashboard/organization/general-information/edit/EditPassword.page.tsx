import { ODS_MODAL_COLOR } from '@ovhcloud/ods-components';
import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Modal } from '@ovh-ux/manager-react-components';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { OdsText } from '@ovhcloud/ods-components/react';
import { useResetVcdPassword } from '@ovh-ux/manager-module-vcd-api';
import { useMessageContext } from '@/context/Message.context';
import { subRoutes } from '@/routes/routes.constant';

export default function EditPassword() {
  const { t } = useTranslation('dashboard');
  const { t: tActions } = useTranslation(NAMESPACES.ACTIONS);
  const navigate = useNavigate();
  const closeModal = () => navigate('..');
  const { id } = useParams();
  const { addSuccess, addError } = useMessageContext();
  const { mutate: resetPassword, isPending } = useResetVcdPassword(
    { id },
    {
      onSettled: () => closeModal(),
      onSuccess: () =>
        addSuccess({
          content: t('managed_vcd_dashboard_password_renew_success'),
          includedSubRoutes: [id],
          excludedSubRoutes: [subRoutes.virtualDatacenters],
        }),
      onError: () =>
        addError({
          content: t('managed_vcd_dashboard_password_renew_error'),
          includedSubRoutes: [id],
          excludedSubRoutes: [subRoutes.virtualDatacenters],
        }),
    },
  );

  return (
    <Modal
      isOpen
      heading={t('managed_vcd_dashboard_password_modal_title')}
      type={ODS_MODAL_COLOR.information}
      primaryLabel={tActions('validate')}
      isPrimaryButtonLoading={isPending}
      isPrimaryButtonDisabled={isPending}
      onPrimaryButtonClick={resetPassword}
      secondaryLabel={tActions('cancel')}
      onSecondaryButtonClick={closeModal}
      onDismiss={closeModal}
    >
      <OdsText>{t('managed_vcd_dashboard_password_modal_subtitle')}</OdsText>
    </Modal>
  );
}
