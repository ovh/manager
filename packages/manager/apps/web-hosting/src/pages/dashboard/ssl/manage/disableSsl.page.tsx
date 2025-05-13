import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { ODS_MODAL_COLOR } from '@ovhcloud/ods-components';
import { OdsText } from '@ovhcloud/ods-components/react';
import { Modal, useNotifications } from '@ovh-ux/manager-react-components';

import { useTranslation } from 'react-i18next';
import { useDeleteDomainCertificate } from '@/data/hooks/ssl/useSsl';
import { subRoutes, urls } from '@/routes/routes.constants';

export default function DisableSslModal() {
  const { serviceName, domain } = useParams();

  const { addSuccess, addWarning } = useNotifications();
  const navigate = useNavigate();
  const closeModal = () =>
    navigate(urls.ssl.replace(subRoutes.serviceName, serviceName));
  const { t } = useTranslation('ssl');
  const { deleteDomainCertificate } = useDeleteDomainCertificate(
    serviceName,
    () => {
      addSuccess(t('hosting_dashboard_ssl_delete_success'), true);
    },
    () => {
      addWarning(t('hosting_dashboard_ssl_delete_error'), true);
    },
  );

  const onConfirm = () => {
    deleteDomainCertificate(domain);
    closeModal();
  };

  return (
    <Modal
      onOdsClose={closeModal}
      isOpen
      type={ODS_MODAL_COLOR.critical}
      heading={t('delete_ssl')}
      primaryLabel={t('buttons_validate')}
      secondaryLabel={t('buttons_cancel')}
      onPrimaryButtonClick={onConfirm}
      onSecondaryButtonClick={closeModal}
    >
      <OdsText>{t('delete_ssl_message')}</OdsText>
    </Modal>
  );
}
