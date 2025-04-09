import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

import { ODS_BUTTON_VARIANT, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import {
  OdsButton,
  OdsFormField,
  OdsModal,
  OdsText,
  OdsTextarea,
} from '@ovhcloud/ods-components/react';
import { useTranslation } from 'react-i18next';
import { useCreateCertificate } from '@/data/hooks/useSsl';

type TImportModal = {
  onClose: () => void;
  setMessage: ({ status, label }: { status: string; label: string }) => void;
};

export default function ImportModal({
  onClose,
  setMessage,
}: Readonly<TImportModal>) {
  const { serviceName } = useParams();
  const [certificate, setCertificate] = useState('');
  const [key, setKey] = useState('');
  const [chain, setChain] = useState('');
  const { t } = useTranslation('ssl');
  const { createCertificate } = useCreateCertificate(
    serviceName,
    () => {
      setMessage({
        status: 'success',
        label: t('hosting_dashboard_ssl_order_success'),
      });
    },
    () => {
      setMessage({
        status: 'error',
        label: t('hosting_dashboard_ssl_order_error'),
      });
    },
  );

  const onConfirm = () => {
    createCertificate({ certificate, key, chain });
    onClose();
  };

  return (
    <OdsModal
      onOdsClose={onClose}
      isOpen
      className="flex flex-col space-y-8 mb-10"
    >
      <OdsText preset={ODS_TEXT_PRESET.heading3}>
        {t('import_ssl_certificate')}
      </OdsText>

      <OdsFormField className="w-full">
        <div slot="label">
          <OdsText className="block">
            {t('ssl_order_manual_mode_certif')}
          </OdsText>
        </div>
        <OdsTextarea
          name="manualCertif"
          isResizable
          rows={5}
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
          rows={5}
          value={key}
          onOdsChange={(e) => setKey(e.detail.value)}
        />
      </OdsFormField>
      <OdsFormField className="w-full">
        <div slot="label">
          <OdsText className="block">
            {t('ssl_order_manual_mode_chain')}
          </OdsText>
        </div>
        <OdsTextarea
          name="modeChain"
          isResizable
          rows={5}
          value={chain}
          onOdsChange={(e) => setChain(e.detail.value)}
        />
      </OdsFormField>
      <div className="mt-5 flex space-x-4" slot="actions">
        <OdsButton
          label={t('buttons_cancel')}
          variant={ODS_BUTTON_VARIANT.ghost}
          onClick={onClose}
        />

        <OdsButton
          label={t('buttons_validate')}
          onClick={onConfirm}
          data-testid="importModal-button_confirm"
        />
      </div>
    </OdsModal>
  );
}
