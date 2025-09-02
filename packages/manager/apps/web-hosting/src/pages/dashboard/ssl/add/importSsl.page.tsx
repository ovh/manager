import React, { useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { OdsFormField, OdsText, OdsTextarea } from '@ovhcloud/ods-components/react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Modal, useNotifications } from '@ovh-ux/manager-react-components';

import { useCreateCertificate } from '@/data/hooks/ssl/useSsl';
import { subRoutes, urls } from '@/routes/routes.constants';

export default function ImportModal() {
  const { serviceName } = useParams();

  const { addSuccess, addWarning } = useNotifications();
  const navigate = useNavigate();
  const closeModal = () => navigate(urls.ssl.replace(subRoutes.serviceName, serviceName));
  const [certificate, setCertificate] = useState('');
  const [key, setKey] = useState('');
  const [chain, setChain] = useState('');
  const { t } = useTranslation(['ssl', NAMESPACES.ACTIONS]);

  const { createCertificate } = useCreateCertificate(
    serviceName,
    () => {
      addSuccess(t('hosting_dashboard_ssl_import_success'), true);
    },
    (error) => {
      addWarning(
        t('hosting_dashboard_ssl_order_error', {
          error: error?.response?.data?.message,
        }),
        true,
      );
    },
  );

  const onConfirm = () => {
    createCertificate({ certificate, key, chain });
    closeModal();
  };

  return (
    <Modal
      onDismiss={closeModal}
      isOpen
      isPrimaryButtonDisabled={Boolean(!certificate || !key)}
      heading={t('import_ssl_certificate')}
      primaryLabel={t(`${NAMESPACES.ACTIONS}:validate`)}
      secondaryLabel={t(`${NAMESPACES.ACTIONS}:cancel`)}
      onPrimaryButtonClick={onConfirm}
      onSecondaryButtonClick={closeModal}
    >
      <div className="flex flex-col space-y-4 mb-4">
        <OdsFormField className="w-full">
          <div slot="label">
            <OdsText className="block">{t('ssl_order_manual_mode_certif')}</OdsText>
          </div>
          <OdsTextarea
            name="manualCertif"
            isResizable
            rows={3}
            value={certificate}
            onOdsChange={(e) => setCertificate(e.detail.value)}
          />
        </OdsFormField>
        <OdsFormField className="w-full">
          <div slot="label">
            <OdsText className="block">{t('ssl_order_manual_mode_key')}</OdsText>
          </div>
          <OdsTextarea
            name="modeKey"
            isResizable
            rows={3}
            value={key}
            onOdsChange={(e) => setKey(e.detail.value)}
          />
        </OdsFormField>
        <OdsFormField className="w-full">
          <div slot="label">
            <OdsText className="block">{t('ssl_order_manual_mode_chain')}</OdsText>
          </div>
          <OdsTextarea
            name="modeChain"
            isResizable
            rows={3}
            value={chain}
            onOdsChange={(e) => setChain(e.detail.value)}
          />
        </OdsFormField>
      </div>
    </Modal>
  );
}
