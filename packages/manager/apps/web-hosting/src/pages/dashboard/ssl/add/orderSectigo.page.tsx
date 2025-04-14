import React, { useContext, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';

import { ODS_MESSAGE_COLOR } from '@ovhcloud/ods-components';
import { OdsMessage, OdsSelect, OdsText } from '@ovhcloud/ods-components/react';
import { Modal } from '@ovh-ux/manager-react-components';

import { subRoutes, urls } from '@/routes/routes.constants';
import { DOMAIN_ORDER_OPTIONS_SERVICE } from '@/constants';
import { useWebHostingAttachedDomain } from '@/data/hooks/webHostingAttachedDomain/useWebHostingAttachedDomain';

export default function SectigoModal() {
  const context = useContext(ShellContext);
  const { serviceName } = useParams();
  const navigate = useNavigate();
  const closeModal = () =>
    navigate(urls.ssl.replace(subRoutes.serviceName, serviceName));
  const { data } = useWebHostingAttachedDomain({ shouldFetchAll: true });

  const { ovhSubsidiary } = context.environment.getUser();
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
    closeModal();
  };

  return (
    <Modal
      onOdsClose={closeModal}
      isOpen
      heading={t('order_ssl_certificate')}
      primaryLabel={t('buttons_validate')}
      secondaryLabel={t('buttons_cancel')}
      onPrimaryButtonClick={onConfirm}
      onSecondaryButtonClick={closeModal}
    >
      <div className="flex flex-col space-y-8 mb-10">
        <OdsSelect
          name="modalDomainName"
          placeholder={t('select_domain')}
          onOdsChange={(e) => setSelectedDomain(e?.detail.value as string)}
        >
          {data?.map((item) => (
            <option value={item?.currentState?.fqdn} key={item?.id}>
              {item?.currentState?.fqdn}
            </option>
          ))}
        </OdsSelect>
        <OdsMessage color={ODS_MESSAGE_COLOR.warning} isDismissible={false}>
          {t('ssl_info_warning')}
        </OdsMessage>
        <OdsText>{t('purchase_ssl')}</OdsText>
      </div>
    </Modal>
  );
}
