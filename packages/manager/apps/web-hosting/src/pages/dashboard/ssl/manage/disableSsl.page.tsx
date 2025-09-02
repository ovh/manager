import React from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ODS_MODAL_COLOR, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsText } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Modal, useNotifications } from '@ovh-ux/manager-react-components';

import { useDeleteDomainCertificate } from '@/data/hooks/ssl/useSsl';
import { subRoutes, urls } from '@/routes/routes.constants';

export default function DisableSslModal() {
  const { serviceName, domain } = useParams();

  const { addSuccess, addWarning } = useNotifications();
  const navigate = useNavigate();
  const closeModal = () => navigate(urls.ssl.replace(subRoutes.serviceName, serviceName));
  const { t } = useTranslation(['ssl', NAMESPACES.ACTIONS]);

  const { deleteDomainCertificate } = useDeleteDomainCertificate(
    serviceName,
    () => {
      addSuccess(t('hosting_dashboard_ssl_delete_success'), true);
    },
    (error) => {
      addWarning(
        t('hosting_dashboard_ssl_delete_error', {
          error: error?.response?.data?.message,
        }),
        true,
      );
    },
  );

  const onConfirm = () => {
    deleteDomainCertificate(domain);
    closeModal();
  };

  return (
    <Modal
      onDismiss={closeModal}
      isOpen
      type={ODS_MODAL_COLOR.critical}
      heading={t('delete_ssl')}
      primaryLabel={t(`${NAMESPACES.ACTIONS}:validate`)}
      secondaryLabel={t(`${NAMESPACES.ACTIONS}:cancel`)}
      onPrimaryButtonClick={onConfirm}
      onSecondaryButtonClick={closeModal}
    >
      <div className="flex flex-col space-y-8 mb-8 mt-8">
        <div className="flex flex-row">
          <OdsText preset={ODS_TEXT_PRESET.heading6} className="flex justify-end mr-10 w-1/2">
            {t('hosting_domain_name')}
          </OdsText>
          <OdsText className="w-1/2">{domain}</OdsText>
        </div>
        <OdsText>{t('delete_ssl_message')}</OdsText>
      </div>
    </Modal>
  );
}
