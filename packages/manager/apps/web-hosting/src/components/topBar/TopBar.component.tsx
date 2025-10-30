import React, { useState } from 'react';

import { useNavigate, useParams } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

import {
  BUTTON_SIZE,
  BUTTON_VARIANT,
  Button,
  Select,
  SelectContent,
  SelectControl,
  TEXT_PRESET,
  Text,
} from '@ovhcloud/ods-react';

import { useNotifications } from '@ovh-ux/muk';

import { useCreateDomainCertificates } from '@/data/hooks/ssl/useSsl';
import { useWebHostingAttachedDomain } from '@/data/hooks/webHostingAttachedDomain/useWebHostingAttachedDomain';
import { ServiceStatus } from '@/data/types/status';
import { subRoutes, urls } from '@/routes/routes.constants';

export default function Topbar() {
  const navigate = useNavigate();
  const { serviceName } = useParams();
  const { addSuccess, addWarning } = useNotifications();

  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);
  const { data } = useWebHostingAttachedDomain({ shouldFetchAll: true });

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

  const selectItems =
    data
      ?.filter(
        (item) =>
          item?.currentState?.ssl?.status !== ServiceStatus.ACTIVE &&
          item?.currentState?.hosting?.serviceName === serviceName &&
          !item?.currentState?.isDefault,
      )
      ?.map((it) => ({
        value: it?.currentState?.fqdn,
        label: it?.currentState?.fqdn,
      })) || [];
  return (
    <div className="flex flex-col space-y-10 mb-10">
      <div className="flex space-x-4">
        <Button
          size={BUTTON_SIZE.sm}
          data-testid="order-ssl"
          onClick={() => navigate(urls.orderSectigo.replace(subRoutes.serviceName, serviceName))}
        >
          {t('order_ssl_certificate')}
        </Button>
        <Button
          size={BUTTON_SIZE.sm}
          data-testid="import-ssl"
          onClick={() => navigate(urls.importSsl.replace(subRoutes.serviceName, serviceName))}
          variant={BUTTON_VARIANT.outline}
        >
          {t('import_ssl_certificate')}
        </Button>
      </div>
      <div className="bg-gray-200 p-6">
        <Text preset={TEXT_PRESET.heading4} className="mb-6">
          {t('enable_ssl_certificate')}
        </Text>
        <div className="flex space-x-4">
          <Select
            name="domainName"
            className="w-1/3"
            multiple={true}
            onValueChange={(detail) => {
              setSelectedDomains(detail.value ?? []);
            }}
            items={selectItems}
          >
            <SelectControl placeholder={t('hosting_dashboard_ssl_selected_item')} />
            <SelectContent />
          </Select>
          <Button size={BUTTON_SIZE.sm} variant={BUTTON_VARIANT.outline} onClick={handleSslEncrypt}>
            {t('enable_ssl_encrypt')}
          </Button>
        </div>
      </div>
    </div>
  );
}
