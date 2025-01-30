import React from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import LogsToCustomerModule from '@ovh-ux/logs-to-customer/src/LogsToCustomer.module';
import { Description } from '@ovh-ux/manager-react-components';
import { useOKMSById } from '@/data/hooks/useOKMS';

export default function KmsLogs() {
  const { t } = useTranslation('key-management-service/logs');

  const { okmsId } = useParams();
  const { data: okms } = useOKMSById(okmsId);

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
        logIamActions={{
          postSubscription: ['okms:apiovh:log/subscription/create'],
          deleteSubscription: ['okms:apiovh:log/subscription/delete'],
        }}
        resourceURN={okms.data.iam.urn}
      />
    </div>
  );
}
