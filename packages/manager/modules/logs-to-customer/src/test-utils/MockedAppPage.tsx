import React from 'react';
import LogsToCustomerModule from '@ovh-ux/logs-to-customer/src/LogsToCustomer.module';
import { apiUrlMocks } from './test.constant';

export const MockedAppPageLabel = 'mocked app page';

export default function MockedAppPage() {
  return (
    <div>
      <div>{MockedAppPageLabel}</div>
      <LogsToCustomerModule
        logApiVersion="v2"
        logApiUrls={{
          logKind: apiUrlMocks.logKind,
          logSubscription: apiUrlMocks.logSubscription,
          logUrl: apiUrlMocks.logUrl,
        }}
      />
    </div>
  );
}
