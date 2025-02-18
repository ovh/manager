import React from 'react';
import { useParams } from 'react-router-dom';
import LogsToCustomerModule from '@ovh-ux/logs-to-customer/src/LogsToCustomer.module';
import { useOKMSById } from '@/data/hooks/useOKMS';

export default function KmsLogs() {
  const { okmsId } = useParams();
  const { data: okms } = useOKMSById(okmsId);

  return (
    <div className="flex flex-col gap-4">
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
        trackingOptions={{ trackingSuffix: 'kms' }}
      />
    </div>
  );
}
