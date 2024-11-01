import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { OsdsModal, OsdsButton } from '@ovhcloud/ods-components/react';
import { Description } from '@ovh-ux/manager-react-components';
import { ODS_THEME_COLOR_INTENT } from '@ovhcloud/ods-common-theming';
import { ODS_BUTTON_VARIANT } from '@ovhcloud/ods-components';
import { useResetPassword } from '@/data/hooks/useResetPassword';
import { useMessageContext } from '@/context/Message.context';
import { subRoutes } from '@/routes/routes.constant';

export default function EditPassword() {
  const { t } = useTranslation('dashboard');
  const navigate = useNavigate();
  const closeModal = () => navigate('..');
  const { id } = useParams();
  const { addSuccess, addError } = useMessageContext();
  const { mutate: resetPassword } = useResetPassword(
    { id },
    {
      onSettled: () => closeModal(),
      onSuccess: () =>
        addSuccess({
          content: t('managed_vcd_dashboard_password_renew_success'),
          dismissable: true,
          includedSubRoutes: [id],
          excludedSubRoutes: [subRoutes.datacentres],
        }),
      onError: () =>
        addError({
          content: t('managed_vcd_dashboard_password_renew_error'),
          dismissable: true,
          includedSubRoutes: [id],
          excludedSubRoutes: [subRoutes.datacentres],
        }),
    },
  );

  return (
    <OsdsModal
      color={ODS_THEME_COLOR_INTENT.info}
      onOdsModalClose={closeModal}
      dismissible
      headline={t('managed_vcd_dashboard_password_modal_title')}
    >
      <Description className="mt-6">
        {t('managed_vcd_dashboard_password_modal_subtitle')}
      </Description>
      <OsdsButton
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        variant={ODS_BUTTON_VARIANT.stroked}
        onClick={closeModal}
      >
        {t('managed_vcd_dashboard_edit_modal_cta_cancel')}
      </OsdsButton>
      <OsdsButton
        slot="actions"
        color={ODS_THEME_COLOR_INTENT.primary}
        variant={ODS_BUTTON_VARIANT.flat}
        onClick={() => resetPassword()}
      >
        {t('managed_vcd_dashboard_edit_modal_cta_validate')}
      </OsdsButton>
    </OsdsModal>
  );
}
