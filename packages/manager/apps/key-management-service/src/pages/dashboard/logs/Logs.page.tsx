import { LogsToCustomerModule } from '@ovh-ux/logs-to-customer';
import {
  RedirectionGuard,
  useFeatureAvailability,
} from '@ovh-ux/manager-react-components';
import React from 'react';
import { useParams } from 'react-router-dom';
import { useOkmsById } from '@/data/hooks/useOkms';
import { KMS_FEATURES } from '@/utils/feature-availability/feature-availability.constants';
import { KMS_ROUTES_URLS } from '@/routes/routes.constants';

export default function KmsLogs() {
  const { okmsId } = useParams() as { okmsId: string };
  const { data: okms, isPending: isOkmsPending } = useOkmsById(okmsId);

  const {
    data: features,
    isPending: isPendingFeatures,
  } = useFeatureAvailability([KMS_FEATURES.LOGS]);

  return (
    <RedirectionGuard
      condition={features ? !features[KMS_FEATURES.LOGS] : false}
      isLoading={isPendingFeatures || isOkmsPending}
      route={KMS_ROUTES_URLS.kmsDashboard(okmsId)}
    >
      <div className="flex flex-col gap-4">
        {okms && (
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
        )}
      </div>
    </RedirectionGuard>
  );
}
