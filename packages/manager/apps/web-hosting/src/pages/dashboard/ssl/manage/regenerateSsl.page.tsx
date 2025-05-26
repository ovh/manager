import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { OdsText } from '@ovhcloud/ods-components/react';
import { Modal, useNotifications } from '@ovh-ux/manager-react-components';

import { useTranslation } from 'react-i18next';
import { useRegenerateDomainCertificate } from '@/data/hooks/ssl/useSsl';
import { subRoutes, urls } from '@/routes/routes.constants';

export default function RegenerateSslModal() {
  const { serviceName, domain } = useParams();

  const { addSuccess, addWarning } = useNotifications();
  const navigate = useNavigate();
  const closeModal = () =>
    navigate(urls.ssl.replace(subRoutes.serviceName, serviceName));
  const { t } = useTranslation('ssl');

  const { regenerateDomainCertificate } = useRegenerateDomainCertificate(
    serviceName,
    () => {
      addSuccess(t('hosting_dashboard_ssl_regenerate_success'), true);
    },
    () => {
      addWarning(t('hosting_dashboard_ssl_regenerate_error'), true);
    },
  );

  const onConfirm = () => {
    regenerateDomainCertificate(domain);
    closeModal();
  };

  return (
    <Modal
      onOdsClose={closeModal}
      isOpen
      heading={t('regenerate_ssl')}
      primaryLabel={t('buttons_validate')}
      secondaryLabel={t('buttons_cancel')}
      onPrimaryButtonClick={onConfirm}
      onSecondaryButtonClick={closeModal}
    >
      <OdsText>{t('regenerate_ssl_message')}</OdsText>
    </Modal>
  );
}
