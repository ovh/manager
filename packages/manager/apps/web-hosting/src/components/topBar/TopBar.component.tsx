import React, { useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import { ODS_BUTTON_SIZE, ODS_BUTTON_VARIANT, ODS_TEXT_PRESET } from '@ovhcloud/ods-components';
import { OdsButton, OdsSelect, OdsText } from '@ovhcloud/ods-components/react';

import { useNotifications, useResourcesIcebergV2 } from '@ovh-ux/manager-react-components';

import { useCreateDomainCertificates } from '@/data/hooks/ssl/useSsl';
import { WebsiteType } from '@/data/types/product/website';
import { ServiceStatus } from '@/data/types/status';
import { subRoutes, urls } from '@/routes/routes.constants';
import { APIV2_MAX_PAGESIZE } from '@/utils';

export default function Topbar() {
  const navigate = useNavigate();
  const { serviceName } = useParams();
  const { addSuccess, addWarning } = useNotifications();

  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const { flattenData } = useResourcesIcebergV2<WebsiteType>({
    route: `/webhosting/resource/${serviceName}/attachedDomain`,
    queryKey: ['webhosting', 'resource', serviceName, 'attachedDomain'],
    pageSize: APIV2_MAX_PAGESIZE,
  });

  const { t } = useTranslation('ssl');

  const { createDomainCertificates } = useCreateDomainCertificates(
    serviceName,
    () => {
      addSuccess(t('hosting_dashboard_ssl_activation_success'), true);
    },
    (error) => {
      addWarning(
        t('hosting_dashboard_ssl_activation_error', {
          error: error?.response?.data?.message,
        }),
        true,
      );
    },
  );

  const handleSslEncrypt = () => {
    createDomainCertificates(selectedDomains);
  };

  return (
    <div className="mb-10 flex flex-col space-y-10">
      <div className="flex space-x-4">
        <OdsButton
          size={ODS_BUTTON_SIZE.sm}
          data-testid="order-ssl"
          onClick={() => navigate(urls.orderSectigo.replace(subRoutes.serviceName, serviceName))}
          label={t('order_ssl_certificate')}
        />
        <OdsButton
          size={ODS_BUTTON_SIZE.sm}
          data-testid="import-ssl"
          onClick={() => navigate(urls.importSsl.replace(subRoutes.serviceName, serviceName))}
          variant={ODS_BUTTON_VARIANT.outline}
          label={t('import_ssl_certificate')}
        />
      </div>
      <div className="bg-gray-200 p-6">
        <OdsText preset={ODS_TEXT_PRESET.heading4} className="mb-6">
          {t('enable_ssl_certificate')}
        </OdsText>
        <div className="flex space-x-4">
          <OdsSelect
            name="domainName"
            className="w-1/3"
            multipleSelectionLabel={t('hosting_dashboard_ssl_selected_item')}
            allowMultiple
            onOdsChange={(v) => {
              setSelectedDomains(v.detail.value?.toString()?.split(','));
            }}
          >
            {flattenData
              ?.filter(
                (item) =>
                  item?.currentState?.ssl?.status !== ServiceStatus.ACTIVE &&
                  !item?.currentState?.isDefault,
              )
              ?.map((it) => (
                <option value={it?.currentState?.fqdn} key={it?.currentState?.fqdn}>
                  {it?.currentState?.fqdn}
                </option>
              ))}
          </OdsSelect>
          <OdsButton
            size={ODS_BUTTON_SIZE.sm}
            variant={ODS_BUTTON_VARIANT.outline}
            onClick={handleSslEncrypt}
            label={t('enable_ssl_encrypt')}
          />
        </div>
      </div>
    </div>
  );
}
