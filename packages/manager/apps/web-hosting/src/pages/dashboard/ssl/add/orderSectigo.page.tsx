import { useContext, useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import {
  MESSAGE_COLOR,
  Message,
  Select,
  SelectContent,
  SelectControl,
  Text,
} from '@ovhcloud/ods-react';

import { NAMESPACES } from '@ovh-ux/manager-common-translations';
import { ShellContext } from '@ovh-ux/manager-react-shell-client';
import { Modal, useDataApi } from '@ovh-ux/muk';

import { DOMAIN_ORDER_OPTIONS_SERVICE } from '@/constants';
import { WebsiteType } from '@/data/types/product/website';
import { subRoutes, urls } from '@/routes/routes.constants';
import { APIV2_MAX_PAGESIZE } from '@/utils';

export default function SectigoModal() {
  const context = useContext(ShellContext);
  const { serviceName } = useParams();
  const navigate = useNavigate();
  const closeModal = () => navigate(urls.ssl.replace(subRoutes.serviceName, serviceName));
  const { flattenData } = useDataApi<WebsiteType>({
    route: `/webhosting/resource/${serviceName}/attachedDomain`,
    cacheKey: ['webhosting', 'resource', serviceName, 'attachedDomain'],
    pageSize: APIV2_MAX_PAGESIZE,
    enabled: !!serviceName,
    iceberg: true,
    version: 'v2',
  });

  const { ovhSubsidiary } = context.environment.getUser();
  const [selectedDomain, setSelectedDomain] = useState('');
  const { t } = useTranslation(['ssl', NAMESPACES.ACTIONS]);

  const rawOrderFormURL =
    DOMAIN_ORDER_OPTIONS_SERVICE[ovhSubsidiary as keyof typeof DOMAIN_ORDER_OPTIONS_SERVICE] ??
    DOMAIN_ORDER_OPTIONS_SERVICE.FR;

  const onConfirm = () => {
    const certificateLink = rawOrderFormURL
      .replace('{serviceName}', serviceName)
      .replace('{domainName}', selectedDomain);
    window.open(certificateLink, '_blank');
    closeModal();
  };
  const selectItems =
    flattenData?.map((item) => ({
      value: item?.currentState?.fqdn,
      label: item?.currentState?.fqdn,
    })) || [];
  return (
    <Modal
      onOpenChange={closeModal}
      open
      heading={t('order_ssl_certificate')}
      primaryButton={{
        label: t(`${NAMESPACES.ACTIONS}:validate`),
        onClick: onConfirm,
      }}
      secondaryButton={{
        label: t(`${NAMESPACES.ACTIONS}:cancel`),
        onClick: closeModal,
      }}
    >
      <div className="mb-10 flex flex-col space-y-8">
        <Select
          id="ssl-select-domain"
          data-testid="ssl-select-domain"
          name="modalDomainName"
          items={selectItems}
          onValueChange={(detail) => setSelectedDomain(detail.value as unknown as string)}
        >
          <SelectControl aria-label={t('select_domain')} placeholder={t('select_domain')} />
          <SelectContent createPortal={false} />
        </Select>
        <Message color={MESSAGE_COLOR.warning} dismissible={false}>
          {t('ssl_info_warning')}
        </Message>
        <Text>{t('purchase_ssl')}</Text>
      </div>
    </Modal>
  );
}
