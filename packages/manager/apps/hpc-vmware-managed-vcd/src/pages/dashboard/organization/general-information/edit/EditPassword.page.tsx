import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { OdsText, OdsButton, OdsModal } from '@ovhcloud/ods-components/react';
import { useResetVcdPassword } from '@ovh-ux/manager-module-vcd-api';
import { useMessageContext } from '@/context/Message.context';
import { subRoutes } from '@/routes/routes.constant';

export default function EditPassword() {
  const { t } = useTranslation('dashboard');
  const navigate = useNavigate();
  const closeModal = () => navigate('..');
  const { id } = useParams();
  const { addSuccess, addError } = useMessageContext();
  const { mutate: resetPassword } = useResetVcdPassword(
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
    <OdsModal onOdsClose={closeModal} isOpen isDismissible>
      <OdsText preset="heading-3">
        {t('managed_vcd_dashboard_password_modal_title')}
      </OdsText>
      <OdsText className="mt-6">
        {t('managed_vcd_dashboard_password_modal_subtitle')}
      </OdsText>
      <OdsButton
        label={t('managed_vcd_dashboard_edit_modal_cta_cancel')}
        variant="outline"
        onClick={closeModal}
      />

      <OdsButton
        label={t('managed_vcd_dashboard_edit_modal_cta_validate')}
        variant="ghost"
        onClick={() => resetPassword()}
      />
    </OdsModal>
  );
}
