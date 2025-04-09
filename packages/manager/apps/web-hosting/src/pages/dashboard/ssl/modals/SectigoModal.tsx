import React, { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

import {
  ODS_BUTTON_VARIANT,
  ODS_MESSAGE_COLOR,
  ODS_TEXT_PRESET,
} from '@ovhcloud/ods-components';
import {
  OdsButton,
  OdsMessage,
  OdsModal,
  OdsSelect,
  OdsText,
} from '@ovhcloud/ods-components/react';
import { AttachedDomain } from '@/types/ssl';
import { DOMAIN_ORDER_OPTIONS_SERVICE } from '@/constants';

type TSectigoModal = {
  domains: unknown[];
  onClose: () => void;
};

export default function SectigoModal({
  domains,
  onClose,
}: Readonly<TSectigoModal>) {
  const context = useContext(ShellContext);
  const { ovhSubsidiary } = context.environment.getUser();
  const { serviceName } = useParams();
  const [selectedDomain, setSelectedDomain] = useState('');
  const { t } = useTranslation('ssl');

  const rawOrderFormURL =
    DOMAIN_ORDER_OPTIONS_SERVICE[
      ovhSubsidiary as keyof typeof DOMAIN_ORDER_OPTIONS_SERVICE
    ] ?? DOMAIN_ORDER_OPTIONS_SERVICE.FR;

  const onConfirm = () => {
    const certificateLink = rawOrderFormURL
      .replace('{serviceName}', serviceName)
      .replace('{domainName}', selectedDomain);
    window.open(certificateLink, '_blank');
    onClose();
  };

  return (
    <OdsModal
      onOdsClose={onClose}
      isOpen
      className="flex flex-col space-y-8 mb-10"
    >
      <OdsText preset={ODS_TEXT_PRESET.heading3} className="mb-8">
        {t('order_ssl_certificate')}
      </OdsText>
      <OdsSelect
        name="modalDomainName"
        placeholder={t('select_domain')}
        onOdsChange={(e) => setSelectedDomain(e?.detail.value as string)}
      >
        {domains?.map((item: AttachedDomain) => (
          <option
            value={item?.currentState?.fqdn}
            key={item?.currentState?.fqdn}
          >
            {item?.currentState?.fqdn}
          </option>
        ))}
      </OdsSelect>
      <OdsMessage color={ODS_MESSAGE_COLOR.warning} isDismissible={false}>
        {t('ssl_info_warning')}
      </OdsMessage>
      <OdsText>{t('purchase_ssl')}</OdsText>
      <div className="mt-5 flex space-x-4" slot="actions">
        <OdsButton
          label={t('buttons_cancel')}
          variant={ODS_BUTTON_VARIANT.ghost}
          onClick={onClose}
        />
        <OdsButton
          label={t('buttons_validate')}
          onClick={onConfirm}
          data-testid="sectigoModal-button_confirm"
        />
      </div>
    </OdsModal>
  );
}
