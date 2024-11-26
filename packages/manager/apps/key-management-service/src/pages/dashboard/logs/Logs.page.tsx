import LogsToCustomerModule from '@ovh-ux/logs-to-customer/src/LogsToCustomer.module';
import { Description } from '@ovh-ux/manager-react-components';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

export default function KmsLogs() {
  const { okmsId } = useParams();
  const { t } = useTranslation('key-management-service/logs');

  return (
    <div className="flex flex-col gap-4">
      <Description>{t('key_management_service_logs_description')}</Description>
      <LogsToCustomerModule
        logApiVersion="v2"
        logApiUrls={{
          logKind: `/okms/resource/${okmsId}/log/kind`,
          logSubscription: `/okms/resource/${okmsId}/log/subscription`,
          logUrl: `/okms/resource/${okmsId}/log/url`,
        }}
      />
    </div>
  );
}
