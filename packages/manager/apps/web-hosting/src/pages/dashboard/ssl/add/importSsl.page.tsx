import React, { useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { FormField, FormFieldLabel, Text, Textarea } from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { Modal, useNotifications } from '@ovh-ux/muk';

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
      onOpenChange={closeModal}
      primaryButton={{
        label: t(`${NAMESPACES.ACTIONS}:validate`),
        onClick: onConfirm,
        disabled: Boolean(!certificate || !key),
      }}
      secondaryButton={{
        label: t(`${NAMESPACES.ACTIONS}:cancel`),
        onClick: closeModal,
      }}
      open
      heading={t('import_ssl_certificate')}
    >
      <div className="flex flex-col space-y-4 mb-4">
        <FormField className="w-full">
          <FormFieldLabel>
            <Text className="block">{t('ssl_order_manual_mode_certif')}</Text>
          </FormFieldLabel>
          <Textarea
            data-testid="ssl-manual-certif"
            name="manualCertif"
            rows={3}
            style={{
              resize: 'both',
            }}
            value={certificate}
            onChange={(e) => setCertificate(e.target.value)}
          />
        </FormField>
        <FormField className="w-full">
          <FormFieldLabel>
            <Text className="block">{t('ssl_order_manual_mode_key')}</Text>
          </FormFieldLabel>
          <Textarea
            data-testid="ssl-mode-key"
            name="modeKey"
            rows={3}
            style={{
              resize: 'both',
            }}
            value={key}
            onChange={(e) => setKey(e.target.value)}
          />
        </FormField>
        <FormField className="w-full">
          <FormFieldLabel>
            <Text className="block">{t('ssl_order_manual_mode_chain')}</Text>
          </FormFieldLabel>
          <Textarea
            data-testid="ssl-mode-chain"
            name="modeChain"
            style={{
              resize: 'both',
            }}
            rows={3}
            value={chain}
            onChange={(e) => setChain(e.target.value)}
          />
        </FormField>
      </div>
    </Modal>
  );
}
