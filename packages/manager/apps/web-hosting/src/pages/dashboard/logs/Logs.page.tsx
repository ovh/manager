import React from 'react';

import { useParams } from 'react-router-dom';

import { LogsToCustomerModule } from '@ovh-ux/logs-to-customer';

import Loading from '@/components/loading/Loading.component';
import { useGetHostingService } from '@/data/hooks/webHostingDashboard/useWebHostingDashboard';

export default function LogsPage() {
  const { serviceName } = useParams<{ serviceName: string }>();
  const { data: hosting, isPending } = useGetHostingService(serviceName || '');

  if (isPending) {
    return <Loading />;
  }

  if (!hosting || !serviceName) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      <LogsToCustomerModule
        logApiVersion="v6"
        logApiUrls={{
          logKind: `/hosting/web/${serviceName}/log/kind`,
          logSubscription: `/hosting/web/${serviceName}/log/subscription`,
          logUrl: `/hosting/web/${serviceName}/log/url`,
        }}
        logIamActions={{
          postSubscription: [
            'webHosting:apiovh:log/subscription/create',
            'ldp:apiovh:output/graylog/stream/forwardTo',
          ],
          deleteSubscription: ['webHosting:apiovh:log/subscription/delete'],
        }}
        resourceURN={hosting.iam?.urn}
        trackingOptions={{ trackingSuffix: 'web-hosting' }}
      />
    </div>
  );
}
