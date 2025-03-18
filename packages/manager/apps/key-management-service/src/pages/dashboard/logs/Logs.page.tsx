import LogsToCustomerModule from '@ovh-ux/logs-to-customer/src/LogsToCustomer.module';
import {
  RedirectionGuard,
  useFeatureAvailability,
} from '@ovh-ux/manager-react-components';
import React from 'react';
import { useParams } from 'react-router-dom';
import { useOKMSById } from '@/data/hooks/useOKMS';
import { FEATURES } from '@/utils/feature-availability/feature-availability.constants';

export default function KmsLogs() {
  const { okmsId } = useParams();
  const { data: okms } = useOKMSById(okmsId);

  const { data: features, isLoading } = useFeatureAvailability([FEATURES.LOGS]);

  return (
    <RedirectionGuard
      condition={features && !features[FEATURES.LOGS]}
      isLoading={isLoading}
      route={`/${okmsId}`}
    >
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
    </RedirectionGuard>
  );
}
